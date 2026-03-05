// server/utils/fetchData.ts
// 네이버 금융(한국주식) + Stooq(미국주식) 데이터 공통 유틸

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
}

/** 티커가 한국 주식인지 판별 (6자리 숫자 or .KS/.KQ/.KX 접미사) */
export function isKoreanTicker(ticker: string): boolean {
  return /^\d{6}$/.test(ticker) || /\.(KS|KQ|KX)$/i.test(ticker)
}

/** 한국 티커에서 순수 종목코드 추출 (005930.KS → 005930) */
export function extractKoreanCode(ticker: string): string {
  return ticker.replace(/\.(KS|KQ|KX)$/i, '')
}

/** Stooq용 티커 변환 (AAPL → aapl.us, ^KS11 → ^ks11) */
export function toStooqTicker(ticker: string): string {
  if (ticker.startsWith('^')) return ticker.toLowerCase()
  return ticker.toLowerCase() + '.us'
}

/** Date → YYYYMMDD 문자열 */
export function toYYYYMMDD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

/** "216,500" 같은 문자열 숫자를 number로 변환 */
export function parseKorPrice(s: string | null | undefined): number {
  if (!s) return 0
  return Number(s.replace(/,/g, ''))
}

/** 간단한 fetch 래퍼 (에러 시 throw, 기본 8초 타임아웃) */
export async function apiFetch(url: string, headers?: Record<string, string>, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      headers: { ...BROWSER_HEADERS, ...headers },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
    return res
  }
  catch (e) {
    clearTimeout(timeoutId)
    throw e
  }
}

/**
 * Stooq 히스토리 CSV 파싱 (format: Date,Open,High,Low,Close,Volume)
 * /q/d/l/ 엔드포인트용
 */
export function parseStooqCSV(csv: string): Array<{
  date: string; open: number; high: number; low: number; close: number; volume: number
}> {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []
  return lines.slice(1)
    .map(line => {
      const parts = line.split(',')
      if (parts.length < 5) return null
      return {
        date: parts[0].trim(),
        open: parseFloat(parts[1]),
        high: parseFloat(parts[2]),
        low: parseFloat(parts[3]),
        close: parseFloat(parts[4]),
        volume: parseInt(parts[5] ?? '0', 10) || 0,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null && !isNaN(row.close))
}

/**
 * Stooq 현재가 CSV 파싱 (format: Symbol,Date,Time,Open,High,Low,Close,Volume)
 * /q/l/ 엔드포인트용 (f=sd2t2ohlcv)
 */
export function parseStooqQuoteCSV(csv: string): {
  date: string; open: number; high: number; low: number; close: number; volume: number
} | null {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return null
  const parts = lines[1].split(',')
  if (parts.length < 8) return null
  return {
    date: parts[1].trim(),
    open: parseFloat(parts[3]),
    high: parseFloat(parts[4]),
    low: parseFloat(parts[5]),
    close: parseFloat(parts[6]),
    volume: parseInt(parts[7] ?? '0', 10) || 0,
  }
}
