// server/api/stock/history/[ticker].get.ts
// 한국주식 → 네이버 금융 가격 이력 API
// 미국주식 → Stooq 이력 CSV

import type { CandlestickData } from '~/types/stock'
import {
  isKoreanTicker,
  extractKoreanCode,
  toStooqTicker,
  parseKorPrice,
  parseStooqCSV,
  toYYYYMMDD,
  apiFetch,
} from '~/server/utils/fetchData'

export default defineEventHandler(async (event) => {
  const ticker = getRouterParam(event, 'ticker')
  const query = getQuery(event)

  if (!ticker) {
    throw createError({ statusCode: 400, statusMessage: 'ticker 파라미터가 필요해요' })
  }

  const period1 = query.period1
    ? new Date(query.period1 as string)
    : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const period2 = query.period2
    ? new Date(query.period2 as string)
    : new Date()

  try {
    if (isKoreanTicker(ticker)) {
      return await fetchKoreanHistory(ticker, period1, period2)
    }
    else {
      return await fetchUsHistory(ticker, period1, period2)
    }
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    throw createError({
      statusCode: 500,
      statusMessage: `${ticker}의 차트 데이터를 불러오는데 실패했어요: ${message}`,
    })
  }
})

/** 네이버 금융 가격 이력 → CandlestickData[] */
async function fetchKoreanHistory(
  ticker: string,
  period1: Date,
  period2: Date,
): Promise<CandlestickData[]> {
  const code = extractKoreanCode(ticker)
  const start = toYYYYMMDD(period1) + '000000'
  const end = toYYYYMMDD(period2) + '235959'

  const res = await apiFetch(
    `https://m.stock.naver.com/api/stock/${code}/price?startDateTime=${start}&endDateTime=${end}&timeframe=day&count=120&requestType=0`,
  )
  const items = await res.json() as Array<Record<string, unknown>>

  return items
    .map(item => ({
      date: new Date((item.localTradedAt as string)).toISOString(),
      open: parseKorPrice(item.openPrice as string),
      high: parseKorPrice(item.highPrice as string),
      low: parseKorPrice(item.lowPrice as string),
      close: parseKorPrice(item.closePrice as string),
      volume: (item.accumulatedTradingVolume as number) ?? 0,
    }))
    .filter(d => d.open > 0 && d.close > 0)
    .reverse() // 네이버는 최신순 → 오래된순으로 역정렬
}

/** Stooq CSV 이력 → CandlestickData[] */
async function fetchUsHistory(
  ticker: string,
  period1: Date,
  period2: Date,
): Promise<CandlestickData[]> {
  const stooqTicker = toStooqTicker(ticker)
  const d1 = toYYYYMMDD(period1)
  const d2 = toYYYYMMDD(period2)

  const res = await apiFetch(
    `https://stooq.com/q/d/l/?s=${stooqTicker}&i=d&d1=${d1}&d2=${d2}`,
  )
  const csv = await res.text()
  const rows = parseStooqCSV(csv)

  return rows.map(row => ({
    date: new Date(row.date).toISOString(),
    open: row.open,
    high: row.high,
    low: row.low,
    close: row.close,
    volume: row.volume,
  }))
}
