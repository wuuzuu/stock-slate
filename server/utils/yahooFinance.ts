// server/utils/yahooFinance.ts
// yahoo-finance2 호출 공통 설정 & 재시도 유틸리티

import yahooFinance from 'yahoo-finance2'

/** 브라우저처럼 보이는 User-Agent */
const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** 모든 yf 호출에 공통으로 쓸 moduleOptions */
export const yfModuleOpts = {
  validateResult: false as const,
  fetchOptions: {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },
}

/** 지정 ms 만큼 대기 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** 재시도 포함 yahooFinance 호출 래퍼 */
export async function yfFetch<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 1500,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    }
    catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      const isRateLimit = msg.includes('Too Many Requests') || msg.includes('429')

      if (isRateLimit && attempt < retries) {
        // 지수 백오프: 1.5s → 3s
        await sleep(delayMs * (attempt + 1))
        continue
      }
      throw error
    }
  }
  throw new Error('최대 재시도 횟수를 초과했어요')
}

export { yahooFinance }
