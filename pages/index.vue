<script setup lang="ts">
// pages/index.vue
// 홈 화면: 시장 지수 + 인기 종목 + 관심종목 + 오늘의 학습 용어

import type { QuoteSummary } from '~/types/stock'
import { useStockStore } from '~/stores/stock'
import { useWatchlistStore } from '~/stores/watchlist'

const stockStore = useStockStore()
const watchlistStore = useWatchlistStore()

// 검색 상태
const searchQuery = ref('')
const isSearchFocused = ref(false)
const searchResults = computed(() => stockStore.searchResults)

let searchTimer: ReturnType<typeof setTimeout> | null = null

/** 영문/숫자 입력 시 디바운스 처리 */
function onSearchInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  triggerSearch(value)
}

/** 한글 IME 조합 완료 시 */
function onCompositionEnd(e: CompositionEvent) {
  const value = (e.target as HTMLInputElement).value
  triggerSearch(value)
}

function triggerSearch(value: string) {
  if (searchTimer) clearTimeout(searchTimer)
  if (!value.trim()) {
    stockStore.clearSearch()
    return
  }
  searchTimer = setTimeout(() => {
    stockStore.searchStocks(value)
  }, 300)
}

/** 검색 결과에서 종목 선택 → 상세 페이지로 이동 */
function selectSearchResult(symbol: string) {
  searchQuery.value = ''
  stockStore.clearSearch()
  isSearchFocused.value = false
  navigateTo(`/stock/${symbol}`)
}

/** 관심종목 패널에서 종목 선택 → 상세 페이지로 이동 */
function onWatchlistSelect(ticker: string) {
  navigateTo(`/stock/${ticker}`)
}

// 홈 화면 데이터 - 시장 지수 + 인기 종목 한 번에 로드
// Stooq 티커: ^SPX(S&P500), ^NDQ(NASDAQ), ^KS11(KOSPI), ^KQ11(KOSDAQ)
const INDEX_TICKERS = ['^KS11', '^KQ11', '^SPX', '^NDQ']
const POPULAR_DOMESTIC_TICKERS = ['005930.KS', '000660.KS', '005380.KS', '035420.KS', '035720.KS']
const POPULAR_US_TICKERS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOG']
const ALL_HOME_TICKERS = [...INDEX_TICKERS, ...POPULAR_DOMESTIC_TICKERS, ...POPULAR_US_TICKERS]

const { data: homeData, pending: isHomeLoading } = await useAsyncData(
  'home-overview',
  () => $fetch<Array<QuoteSummary | null>>('/api/stock/batch-quotes', {
    query: { tickers: ALL_HOME_TICKERS.join(',') },
  }),
)

const marketIndices = computed(() => homeData.value?.slice(0, 4) ?? [])
const popularDomestic = computed(() => homeData.value?.slice(4, 9) ?? [])
const popularUs = computed(() => homeData.value?.slice(9) ?? [])

onMounted(() => {
  watchlistStore.hydrate()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- ─── 헤더 ──────────────────────────────────────────── -->
    <header
      class="sticky top-0 z-40"
      style="background: rgba(6,6,10,0.97); border-bottom: 1px solid rgba(255,0,118,0.25); backdrop-filter: blur(8px);"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <!-- 로고 -->
        <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0">
          <div
            class="flex h-8 w-8 items-center justify-center text-base font-bold"
            style="background: rgba(255,0,118,0.08); border: 1px solid rgba(255,0,118,0.5); color: #FF0076;"
          >
            ▸
          </div>
          <div>
            <span class="text-sm font-bold tracking-widest text-gradient">STOCK.SLATE</span>
            <span class="ml-2 hidden text-xs sm:inline" style="color: rgba(255,0,118,0.65); letter-spacing: 0.08em;">주린이_학습_대시보드</span>
          </div>
        </NuxtLink>

        <!-- 검색바 -->
        <div class="relative flex-1 max-w-lg">
          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold"
              :style="isSearchFocused ? 'color: #FF0076;' : 'color: rgba(255,0,118,0.35);'"
            >▸</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="SEARCH_TICKER... (삼성, AAPL, 005930)"
              class="input-base w-full pl-9 pr-4 text-sm"
              @input="onSearchInput"
              @compositionend="onCompositionEnd"
              @focus="isSearchFocused = true"
              @blur="setTimeout(() => { isSearchFocused = false }, 200)"
            />
          </div>

          <!-- 검색 결과 드롭다운 -->
          <Transition
            enter-active-class="transition-all duration-150"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div
              v-if="isSearchFocused && searchResults.length > 0"
              class="absolute top-full mt-1 w-full overflow-hidden"
              style="background: #0A0A10; border: 1px solid rgba(255,0,118,0.65); box-shadow: 0 12px 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,0,118,0.06);"
            >
              <button
                v-for="result in searchResults"
                :key="result.symbol"
                class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-all duration-100"
                style="border-bottom: 1px solid rgba(255,0,118,0.08);"
                @mouseenter="($event.currentTarget as HTMLElement).style.background = 'rgba(255,0,118,0.06)'"
                @mouseleave="($event.currentTarget as HTMLElement).style.background = 'transparent'"
                @click="selectSearchResult(result.symbol)"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold font-mono"
                    style="background: rgba(255,0,118,0.08); border: 1px solid rgba(255,0,118,0.3); color: #FF4DA6;"
                  >
                    {{ (result.symbol || '').slice(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <span class="text-sm" style="color: #E8E6F0;">{{ result.name || result.symbol }}</span>
                    <span class="ml-2 font-mono text-xs" style="color: rgba(255,0,118,0.5);">{{ result.symbol }}</span>
                  </div>
                </div>
                <span
                  class="px-2 py-0.5 text-xs font-mono"
                  style="background: rgba(255,0,118,0.06); color: rgba(255,0,118,0.5); border: 1px solid rgba(255,0,118,0.15);"
                >
                  {{ result.exchange }}
                </span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- ─── 시장 지수 바 ──────────────────────────────────── -->
    <div
      class="border-b"
      style="background: rgba(6,6,10,0.6); border-color: rgba(255,0,118,0.1);"
    >
      <div class="mx-auto max-w-7xl px-4 py-2">
        <HomeMarketIndices :indices="marketIndices" :loading="isHomeLoading" />
      </div>
    </div>

    <!-- ─── 메인 콘텐츠 ────────────────────────────────────── -->
    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="flex gap-5">
        <!-- 왼쪽: 관심종목 패널 -->
        <aside class="hidden w-52 shrink-0 lg:block">
          <WatchlistPanel @select-stock="onWatchlistSelect" />
        </aside>

        <!-- 중앙: 홈 콘텐츠 -->
        <div class="min-w-0 flex-1 space-y-5">
          <!-- 인기 종목 섹션 -->
          <div class="card">
            <HomePopularStocksGrid
              :domestic="popularDomestic"
              :us="popularUs"
              :loading="isHomeLoading"
            />
          </div>

          <!-- 오늘의 학습 용어 -->
          <HomeDailyTerm />
        </div>
      </div>
    </main>

    <!-- 용어 상세 모달 (전역 오버레이) -->
    <GlossaryModal />
  </div>
</template>
