// server/api/stock/quote/[ticker].get.ts
// 한국주식 → 네이버 금융 API
// 미국주식 → Stooq API

import { isKoreanTicker } from '~/server/utils/fetchData'
import { fetchKoreanQuote, fetchUsQuote } from '~/server/utils/stockFetch'

export default defineEventHandler(async (event) => {
  const ticker = getRouterParam(event, 'ticker')
  if (!ticker) {
    throw createError({ statusCode: 400, statusMessage: 'ticker 파라미터가 필요해요' })
  }

  try {
    if (isKoreanTicker(ticker)) {
      return await fetchKoreanQuote(ticker)
    }
    else {
      return await fetchUsQuote(ticker)
    }
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    throw createError({
      statusCode: 404,
      statusMessage: `${ticker}의 주식 데이터를 찾을 수 없어요: ${message}`,
    })
  }
})
