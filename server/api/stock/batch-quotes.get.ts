// server/api/stock/batch-quotes.get.ts
// 여러 종목의 시세를 한 번에 가져오는 API (홈 화면 전용)
// ?tickers=005930.KS,AAPL,^KS11,...
// apiFetch에 8초 타임아웃이 있으므로, 전체 응답은 최대 16초 (quote + history 각 8초)

import type { QuoteSummary } from '~/types/stock'
import { isKoreanTicker } from '~/server/utils/fetchData'
import { isKoreanIndex, fetchKoreanIndex, fetchKoreanQuote, fetchUsQuote } from '~/server/utils/stockFetch'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tickerStr = (query.tickers as string) ?? ''

  if (!tickerStr) {
    throw createError({ statusCode: 400, statusMessage: 'tickers 파라미터가 필요해요' })
  }

  const tickers = tickerStr.split(',').map(t => t.trim()).filter(Boolean).slice(0, 20)

  // Promise.allSettled: 일부 실패해도 나머지 결과 반환
  const results = await Promise.allSettled(
    tickers.map(ticker => {
      if (isKoreanIndex(ticker)) return fetchKoreanIndex(ticker)
      if (isKoreanTicker(ticker)) return fetchKoreanQuote(ticker)
      return fetchUsQuote(ticker)
    }),
  )

  return tickers.map((ticker, i) => {
    const result = results[i]
    if (result.status === 'fulfilled') {
      const q = result.value
      // NaN은 JSON 직렬화 시 null로 변환되므로, 유효하지 않은 가격은 null 처리
      if (isNaN(q.regularMarketPrice) || q.regularMarketPrice == null) return null
      return {
        symbol: q.symbol,
        name: q.shortName ?? ticker,
        price: q.regularMarketPrice,
        change: isNaN(q.regularMarketChange) ? 0 : q.regularMarketChange,
        changePercent: isNaN(q.regularMarketChangePercent) ? 0 : q.regularMarketChangePercent,
        currency: q.currency,
      } as QuoteSummary
    }
    return null
  })
})
