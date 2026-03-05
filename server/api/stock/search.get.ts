// server/api/stock/search.get.ts
// 한국주식 → 네이버 금융 자동완성 API
// 미국주식 → 입력 티커를 Stooq에서 직접 조회해서 확인

import type { StockSearchResult } from '~/types/stock'
import { isKoreanTicker, toStooqTicker, parseStooqCSV, apiFetch } from '~/server/utils/fetchData'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)

  if (!q || typeof q !== 'string' || q.trim().length < 1) {
    throw createError({ statusCode: 400, statusMessage: '검색어(q)가 필요해요' })
  }

  const query = q.trim()

  try {
    // 한국어 검색어 or 6자리 숫자 코드 → 네이버 검색
    if (/[가-힣]/.test(query) || isKoreanTicker(query)) {
      return await searchKorean(query)
    }

    // 영문 티커 → 네이버 + Stooq 동시 검색
    const [korResults, usResult] = await Promise.allSettled([
      searchKorean(query),
      verifyUsStock(query),
    ])

    const results: StockSearchResult[] = []
    if (korResults.status === 'fulfilled') results.push(...korResults.value)
    if (usResult.status === 'fulfilled' && usResult.value) results.push(usResult.value)

    return results
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    throw createError({ statusCode: 500, statusMessage: `검색에 실패했어요: ${message}` })
  }
})

/** 네이버 자동완성 검색 */
async function searchKorean(query: string): Promise<StockSearchResult[]> {
  const res = await apiFetch(
    `https://ac.stock.naver.com/ac?q=${encodeURIComponent(query)}&target=stock&lang=ko`,
  )
  const data = await res.json() as { items?: Array<Record<string, unknown>> }
  const items = data.items ?? []

  return items
    .filter(item => item.nationCode === 'KOR')
    .slice(0, 10)
    .map(item => {
      const typeCode = (item.typeCode as string) ?? 'KOSPI'
      const code = (item.code as string) ?? ''
      const suffix = typeCode === 'KOSDAQ' ? '.KQ' : '.KS'
      return {
        symbol: `${code}${suffix}`,
        name: (item.name as string) ?? code,
        exchange: typeCode,
        quoteType: 'EQUITY',
      }
    })
    .filter(item => item.symbol)
}

/** 미국 티커 유효성 확인 (Stooq에서 실제 데이터 조회) */
async function verifyUsStock(ticker: string): Promise<StockSearchResult | null> {
  try {
    const stooqTicker = toStooqTicker(ticker)
    const res = await apiFetch(
      `https://stooq.com/q/l/?s=${stooqTicker}&f=sd2t2ohlcv&h&e=csv`,
    )
    const csv = await res.text()
    const rows = parseStooqCSV(csv)
    if (rows.length === 0) return null

    return {
      symbol: ticker.toUpperCase(),
      name: ticker.toUpperCase(),
      exchange: 'US',
      quoteType: 'EQUITY',
    }
  }
  catch {
    return null
  }
}
