// server/utils/stockFetch.ts
// 한국/미국 주식 시세 fetch 로직 (quote API와 batch-quotes API에서 공용으로 사용)

import type { StockQuote } from '~/types/stock'
import {
  extractKoreanCode,
  toStooqTicker,
  toYYYYMMDD,
  parseKorPrice,
  parseStooqCSV,
  parseStooqQuoteCSV,
  apiFetch,
} from '~/server/utils/fetchData'

// 한국 지수 티커 → Naver Finance 코드 매핑
const KOREAN_INDEX_MAP: Record<string, string> = {
  '^KS11': 'KOSPI',
  '^KQ11': 'KOSDAQ',
}

/** 한국 지수 티커 여부 (^KS11, ^KQ11) */
export function isKoreanIndex(ticker: string): boolean {
  return ticker in KOREAN_INDEX_MAP
}

/** Naver Finance 한국 지수 → StockQuote 변환 (^KS11=KOSPI, ^KQ11=KOSDAQ) */
export async function fetchKoreanIndex(ticker: string): Promise<StockQuote> {
  const naverCode = KOREAN_INDEX_MAP[ticker]
  if (!naverCode) throw new Error(`Unknown Korean index: ${ticker}`)

  const priceRes = await apiFetch(
    `https://m.stock.naver.com/api/index/${naverCode}/price?count=2&timeframe=day`,
  )
  const prices = await priceRes.json() as Array<Record<string, unknown>>
  const today = prices[0] ?? {}
  const prev = prices[1] ?? {}

  const closePrice = parseKorPrice(today.closePrice as string)
  const prevClose = parseKorPrice(prev.closePrice as string)
  const change = parseKorPrice(today.compareToPreviousClosePrice as string)
  const changePercent = parseFloat((today.fluctuationsRatio as string) ?? '0')

  return {
    symbol: ticker,
    shortName: naverCode,
    longName: naverCode,
    regularMarketPrice: closePrice,
    regularMarketChange: change,
    regularMarketChangePercent: changePercent,
    regularMarketVolume: 0,
    regularMarketPreviousClose: prevClose,
    regularMarketOpen: parseKorPrice(today.openPrice as string),
    regularMarketDayHigh: parseKorPrice(today.highPrice as string),
    regularMarketDayLow: parseKorPrice(today.lowPrice as string),
    fiftyTwoWeekHigh: 0,
    fiftyTwoWeekLow: 0,
    currency: 'KRW',
    exchange: naverCode,
    quoteType: 'INDEX',
  }
}

/** 네이버 금융 → StockQuote 변환 */
export async function fetchKoreanQuote(ticker: string): Promise<StockQuote> {
  const code = extractKoreanCode(ticker)

  const [basicRes, priceRes] = await Promise.all([
    apiFetch(`https://m.stock.naver.com/api/stock/${code}/basic`),
    apiFetch(`https://m.stock.naver.com/api/stock/${code}/price?count=2&timeframe=day`),
  ])

  const basic = await basicRes.json() as Record<string, unknown>
  const prices = await priceRes.json() as Array<Record<string, unknown>>
  const today = prices[0] ?? {}
  const prev = prices[1] ?? {}

  const closePrice = parseKorPrice(today.closePrice as string)
  const prevClose = parseKorPrice(prev.closePrice as string)
  const change = parseKorPrice(today.compareToPreviousClosePrice as string)
  const changePercent = parseFloat((today.fluctuationsRatio as string) ?? '0')
  const volume = (today.accumulatedTradingVolume as number) ?? 0

  const exchange = (basic.stockExchangeType as Record<string, string>)?.code ?? 'KS'

  return {
    symbol: `${code}.${exchange}`,
    shortName: (basic.stockName as string) ?? code,
    longName: (basic.stockName as string),
    regularMarketPrice: closePrice,
    regularMarketChange: change,
    regularMarketChangePercent: changePercent,
    regularMarketVolume: volume,
    regularMarketPreviousClose: prevClose,
    regularMarketOpen: parseKorPrice(today.openPrice as string),
    regularMarketDayHigh: parseKorPrice(today.highPrice as string),
    regularMarketDayLow: parseKorPrice(today.lowPrice as string),
    fiftyTwoWeekHigh: 0,
    fiftyTwoWeekLow: 0,
    marketCap: undefined,
    trailingPE: undefined,
    forwardPE: undefined,
    dividendYield: undefined,
    currency: 'KRW',
    exchange: exchange === 'KS' ? 'KOSPI' : 'KOSDAQ',
    quoteType: 'EQUITY',
  }
}

/** Stooq → StockQuote 변환 (미국주식 + 지수) */
export async function fetchUsQuote(ticker: string): Promise<StockQuote> {
  const stooqTicker = toStooqTicker(ticker)

  const quoteRes = await apiFetch(
    `https://stooq.com/q/l/?s=${stooqTicker}&f=sd2t2ohlcv&h&e=csv`,
  )
  const quoteCsv = await quoteRes.text()
  const row = parseStooqQuoteCSV(quoteCsv)
  if (!row) throw new Error('데이터가 없어요')

  // 전날 종가만 필요하므로 최근 10일로 제한 (전체 히스토리 다운로드 방지)
  const d2 = toYYYYMMDD(new Date())
  const d1Date = new Date()
  d1Date.setDate(d1Date.getDate() - 10)
  const d1 = toYYYYMMDD(d1Date)
  const histRes = await apiFetch(
    `https://stooq.com/q/d/l/?s=${stooqTicker}&i=d&d1=${d1}&d2=${d2}`,
  )
  const histCsv = await histRes.text()
  const histRows = parseStooqCSV(histCsv)
  const prevClose = histRows.length >= 2 ? histRows[histRows.length - 2].close : row.close

  const change = row.close - prevClose
  const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0

  return {
    symbol: ticker.toUpperCase(),
    shortName: ticker.toUpperCase(),
    longName: ticker.toUpperCase(),
    regularMarketPrice: row.close,
    regularMarketChange: change,
    regularMarketChangePercent: changePercent,
    regularMarketVolume: row.volume,
    regularMarketPreviousClose: prevClose,
    regularMarketOpen: row.open,
    regularMarketDayHigh: row.high,
    regularMarketDayLow: row.low,
    fiftyTwoWeekHigh: 0,
    fiftyTwoWeekLow: 0,
    marketCap: undefined,
    trailingPE: undefined,
    forwardPE: undefined,
    dividendYield: undefined,
    currency: 'USD',
    exchange: 'NASDAQ',
    quoteType: 'EQUITY',
  }
}
