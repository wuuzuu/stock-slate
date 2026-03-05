// types/stock.ts
// 프로젝트 전체에서 사용하는 TypeScript 타입 정의

// ===== API 응답 타입 (yahoo-finance2 기반) =====

/** 실시간 주식 시세 */
export interface StockQuote {
  symbol: string
  shortName: string         // 회사명 (축약)
  longName?: string         // 회사명 (전체)
  regularMarketPrice: number
  regularMarketChange: number
  regularMarketChangePercent: number
  regularMarketVolume: number
  regularMarketPreviousClose: number
  regularMarketOpen: number
  regularMarketDayHigh: number
  regularMarketDayLow: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  marketCap?: number
  trailingPE?: number       // PER (주가수익비율)
  forwardPE?: number
  dividendYield?: number
  currency: string
  exchange: string
  quoteType: string
}

/** 일봉 OHLCV 데이터 (캔들차트용) */
export interface CandlestickData {
  date: string              // ISO 날짜 문자열
  open: number
  high: number
  low: number
  close: number
  volume: number
}

/** ApexCharts 캔들차트 포인트 형식 */
export interface ApexCandlestickPoint {
  x: Date | string
  y: [number, number, number, number] // [open, high, low, close]
}

/** ApexCharts 볼륨 차트 포인트 형식 */
export interface ApexVolumePoint {
  x: Date | string
  y: number
  fillColor?: string
}

// ===== 기술 지표 타입 =====

/** 이동평균선 데이터 */
export interface MovingAverage {
  period: number            // 5, 20, 60, 120 일
  values: { date: string; value: number }[]
  currentValue: number
  label: string             // "5일 이동평균선"
}

/** RSI (상대강도지수) 데이터 */
export interface RSIData {
  values: { date: string; value: number }[]
  currentValue: number
  signal: 'overbought' | 'oversold' | 'neutral' // 70 이상, 30 이하, 그 외
}

/** 모든 기술 지표를 묶는 인터페이스 */
export interface TechnicalIndicators {
  ma5: MovingAverage
  ma20: MovingAverage
  ma60: MovingAverage
  rsi14: RSIData
  volumeAvg20: number       // 20일 평균 거래량
  priceAboveMA5: boolean    // 현재가 > 5일 이동평균선 여부
  priceAboveMA20: boolean   // 현재가 > 20일 이동평균선 여부
  goldenCross: boolean      // 골든크로스 여부 (MA5 > MA20 최근 교차)
  deadCross: boolean        // 데드크로스 여부 (MA5 < MA20 최근 교차)
}

// ===== 학습용 분석 타입 =====

/** 개별 분석 신호 */
export interface AnalysisSignal {
  type: 'positive' | 'negative' | 'neutral' | 'warning'
  category: 'trend' | 'volume' | 'momentum' | 'valuation'
  message: string           // 한국어 교육용 메시지
  detail?: string           // 추가 설명 (선택)
  termKey?: string          // 연관 용어 키 (툴팁 연결용)
}

/** 종목 전체 분석 결과 */
export interface StockAnalysis {
  ticker: string
  signals: AnalysisSignal[]
  summary: string           // 한 줄 요약 (한국어)
  generatedAt: Date
}

// ===== 관심종목 타입 =====

/** 관심종목 항목 */
export interface WatchlistItem {
  ticker: string
  name?: string             // 회사명 (예: 삼성전자, Apple Inc.)
  addedAt: string           // ISO 날짜 문자열
  note?: string             // 개인 학습 메모
}

// ===== 용어 사전 타입 =====

/** 주식 용어 정의 */
export interface GlossaryTerm {
  term: string              // 예: "PER"
  koreanName: string        // 예: "주가수익비율"
  shortExplanation: string  // 한 줄 초보자 설명 (툴팁용)
  fullExplanation: string   // 상세 설명 (모달용)
  example?: string          // 구체적인 숫자 예시
  relatedTerms?: string[]   // 연관 용어 키 목록
  difficulty: 1 | 2 | 3    // 1=완전 초보, 2=중초보, 3=중급
}

// ===== 홈 화면 타입 =====

/** 홈 화면 배치 API 응답 (batch-quotes) */
export interface QuoteSummary {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  currency: 'KRW' | 'USD'
}

// ===== 검색 타입 =====

/** 종목 검색 결과 */
export interface StockSearchResult {
  symbol: string
  name: string
  exchange: string
  quoteType: string
}

// ===== Pinia 스토어 State 타입 =====

export interface StockStoreState {
  currentTicker: string | null
  quote: StockQuote | null
  history: CandlestickData[]
  indicators: TechnicalIndicators | null
  analysis: StockAnalysis | null
  isLoadingQuote: boolean
  isLoadingHistory: boolean
  error: string | null
  searchResults: StockSearchResult[]
}

export interface WatchlistStoreState {
  items: WatchlistItem[]
}

export interface GlossaryStoreState {
  terms: Record<string, GlossaryTerm>
  activeTermKey: string | null
  isModalOpen: boolean
}
