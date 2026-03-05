// stores/stock.ts
// 현재 선택된 종목의 모든 데이터를 관리하는 Pinia 스토어

import { defineStore } from 'pinia'
import type {
  StockQuote,
  CandlestickData,
  TechnicalIndicators,
  StockAnalysis,
  StockSearchResult,
  StockStoreState,
} from '~/types/stock'

export const useStockStore = defineStore('stock', {
  state: (): StockStoreState => ({
    currentTicker: null,
    quote: null,
    history: [],
    indicators: null,
    analysis: null,
    isLoadingQuote: false,
    isLoadingHistory: false,
    error: null,
    searchResults: [],
  }),

  getters: {
    /** 오늘 상승 여부 */
    isUp: (state): boolean => {
      return (state.quote?.regularMarketChange ?? 0) > 0
    },

    /** 오늘 하락 여부 */
    isDown: (state): boolean => {
      return (state.quote?.regularMarketChange ?? 0) < 0
    },

    /** 데이터 로딩 중 여부 (quote + history) */
    isLoading: (state): boolean => {
      return state.isLoadingQuote || state.isLoadingHistory
    },

    /** 화폐 단위에 맞게 포맷된 가격 문자열 */
    formattedPrice: (state): string => {
      if (!state.quote) return '--'
      const { currency, regularMarketPrice } = state.quote
      if (currency === 'KRW') {
        return regularMarketPrice.toLocaleString('ko-KR') + '원'
      }
      return '$' + regularMarketPrice.toFixed(2)
    },

    /** "+2.34%" 형식의 등락률 문자열 */
    changePercentDisplay: (state): string => {
      if (!state.quote) return '--'
      const pct = state.quote.regularMarketChangePercent
      const sign = pct >= 0 ? '+' : ''
      return `${sign}${pct.toFixed(2)}%`
    },

    /** 등락 금액 문자열 */
    changeDisplay: (state): string => {
      if (!state.quote) return '--'
      const { currency, regularMarketChange } = state.quote
      const sign = regularMarketChange >= 0 ? '+' : ''
      if (currency === 'KRW') {
        return `${sign}${regularMarketChange.toLocaleString('ko-KR')}원`
      }
      return `${sign}$${Math.abs(regularMarketChange).toFixed(2)}`
    },
  },

  actions: {
    /**
     * 종목 티커로 모든 데이터를 한 번에 불러오기
     * quote와 history를 병렬로 요청해서 속도를 높여요
     */
    async loadStock(ticker: string) {
      this.currentTicker = ticker
      this.error = null
      this.quote = null
      this.history = []
      this.indicators = null
      this.analysis = null

      // 병렬 요청으로 속도 최적화
      await Promise.allSettled([
        this.fetchQuote(ticker),
        this.fetchHistory(ticker),
      ])
    },

    /** 실시간 시세 조회 */
    async fetchQuote(ticker: string) {
      this.isLoadingQuote = true
      try {
        this.quote = await $fetch<StockQuote>(`/api/stock/quote/${encodeURIComponent(ticker)}`)
      }
      catch (e: unknown) {
        this.error = e instanceof Error ? e.message : '시세 데이터를 불러오는데 실패했어요'
      }
      finally {
        this.isLoadingQuote = false
      }
    },

    /** 차트용 OHLCV 데이터 조회 */
    async fetchHistory(ticker: string, days: number = 90) {
      this.isLoadingHistory = true
      const period1 = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      try {
        this.history = await $fetch<CandlestickData[]>(
          `/api/stock/history/${encodeURIComponent(ticker)}`,
          { query: { period1 } },
        )
      }
      catch (e: unknown) {
        this.error = e instanceof Error ? e.message : '차트 데이터를 불러오는데 실패했어요'
      }
      finally {
        this.isLoadingHistory = false
      }
    },

    /** 종목 검색 */
    async searchStocks(query: string) {
      if (!query.trim()) {
        this.searchResults = []
        return
      }
      try {
        this.searchResults = await $fetch<StockSearchResult[]>('/api/stock/search', {
          query: { q: query },
        })
      }
      catch {
        this.searchResults = []
      }
    },

    /** 기술 지표 설정 (composable에서 계산 후 저장) */
    setIndicators(indicators: TechnicalIndicators) {
      this.indicators = indicators
    },

    /** 분석 결과 설정 */
    setAnalysis(analysis: StockAnalysis) {
      this.analysis = analysis
    },

    clearSearch() {
      this.searchResults = []
    },
  },
})
