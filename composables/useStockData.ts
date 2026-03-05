// composables/useStockData.ts
// 주식 데이터 fetch를 편리하게 사용할 수 있게 해주는 composable

import { useStockStore } from '~/stores/stock'

export function useStockData() {
  const stockStore = useStockStore()
  const { storeToRefs } = usePinia()

  /**
   * 종목 코드로 모든 데이터 불러오기
   * store.loadStock()을 wrapping해서 간편하게 사용
   */
  async function loadStock(ticker: string) {
    await stockStore.loadStock(ticker)
  }

  /**
   * 검색어로 종목 찾기 (디바운스 없음 - 필요시 컴포넌트에서 처리)
   */
  async function searchStocks(query: string) {
    await stockStore.searchStocks(query)
  }

  return {
    loadStock,
    searchStocks,
    // store state를 직접 노출
    quote: computed(() => stockStore.quote),
    history: computed(() => stockStore.history),
    indicators: computed(() => stockStore.indicators),
    analysis: computed(() => stockStore.analysis),
    isLoading: computed(() => stockStore.isLoading),
    error: computed(() => stockStore.error),
    searchResults: computed(() => stockStore.searchResults),
    formattedPrice: computed(() => stockStore.formattedPrice),
    changePercentDisplay: computed(() => stockStore.changePercentDisplay),
    changeDisplay: computed(() => stockStore.changeDisplay),
    isUp: computed(() => stockStore.isUp),
    isDown: computed(() => stockStore.isDown),
  }
}
