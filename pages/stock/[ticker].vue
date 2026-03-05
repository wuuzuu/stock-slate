<script setup lang="ts">
// pages/stock/[ticker].vue
// URL: /stock/005930.KS, /stock/AAPL 등
// 개별 종목 상세 페이지 (index.vue와 동일한 구조, 직접 접근 가능)

import { useStockStore } from '~/stores/stock'
import { useWatchlistStore } from '~/stores/watchlist'
import { useIndicators } from '~/composables/useIndicators'
import { useAnalysis } from '~/composables/useAnalysis'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()
const watchlistStore = useWatchlistStore()
const { calculateIndicators } = useIndicators()
const { analyzeStock } = useAnalysis()

const ticker = computed(() => route.params.ticker as string)

const quote = computed(() => stockStore.quote)
const history = computed(() => stockStore.history)
const indicators = computed(() => stockStore.indicators)
const analysis = computed(() => stockStore.analysis)
const isLoading = computed(() => stockStore.isLoading)
const error = computed(() => stockStore.error)

async function loadStock(t: string) {
  await stockStore.loadStock(t)

  if (stockStore.history.length > 0) {
    const calculatedIndicators = calculateIndicators(stockStore.history)
    if (calculatedIndicators) {
      stockStore.setIndicators(calculatedIndicators)
      if (stockStore.quote) {
        const stockAnalysis = analyzeStock(stockStore.quote, calculatedIndicators)
        stockStore.setAnalysis(stockAnalysis)
      }
    }
  }
}

// 페이지 SEO
useHead({
  title: computed(() =>
    quote.value
      ? `${quote.value.shortName} (${ticker.value}) - Stock Slate`
      : `${ticker.value} - Stock Slate`,
  ),
})

onMounted(async () => {
  watchlistStore.hydrate()
  await loadStock(ticker.value)
})

// 티커 변경 감지 (URL이 바뀔 때)
watch(ticker, (newTicker) => {
  loadStock(newTicker)
})
</script>

<template>
  <div class="min-h-screen">
    <!-- 헤더 -->
    <header
      class="sticky top-0 z-40"
      style="background: rgba(6,6,10,0.97); border-bottom: 1px solid rgba(255,0,118,0.25); backdrop-filter: blur(8px);"
    >
      <div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 transition-all duration-150 shrink-0"
          style="color: rgba(255,0,118,0.5);"
          @mouseenter="($event.currentTarget as HTMLElement).style.color = '#FF0076'"
          @mouseleave="($event.currentTarget as HTMLElement).style.color = 'rgba(255,0,118,0.5)'"
        >
          <span class="text-xs font-bold">◂</span>
          <span class="text-xs font-mono tracking-wider">HOME</span>
        </NuxtLink>
        <span style="color: rgba(255,0,118,0.2); font-size: 0.6rem;">│</span>
        <h1 class="text-sm font-bold" style="color: #E8E6F0;">
          {{ quote?.shortName ?? ticker }}
        </h1>
        <span
          class="px-2 py-0.5 text-xs font-mono font-bold"
          style="background: rgba(255,0,118,0.08); border: 1px solid rgba(255,0,118,0.3); color: #FF4DA6;"
        >{{ ticker }}</span>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <!-- 로딩 -->
      <div v-if="isLoading" class="card flex items-center justify-center py-20">
        <UiLoadingSpinner size="lg" :message="`${ticker} 데이터를 불러오고 있어요...`" />
      </div>

      <!-- 에러 -->
      <UiErrorBanner
        v-else-if="error && !quote"
        :message="error"
        :retryable="true"
        @retry="loadStock(ticker)"
      />

      <!-- 데이터 표시 -->
      <template v-else-if="quote">
        <StockHeader />

        <div class="card">
          <div class="mb-3 flex items-center gap-2">
            <h2 class="text-sm font-semibold text-slate-200">
              <GlossaryTermTooltip term="캔들차트">캔들차트</GlossaryTermTooltip>
            </h2>
            <span class="text-xs font-mono" style="color: rgba(255,0,118,0.65);">최근 90일 일봉</span>
          </div>

          <ClientOnly>
            <ChartCandlestickChart
              :history="history"
              :indicators="indicators"
              :currency="quote.currency"
            />
            <template #fallback>
              <div class="flex h-64 items-center justify-center">
                <UiLoadingSpinner message="차트 로딩 중..." />
              </div>
            </template>
          </ClientOnly>

          <div class="mt-2 border-t border-navy-700 pt-3">
            <ClientOnly>
              <ChartVolumeBar
                :history="history"
                :volume-avg20="indicators?.volumeAvg20"
              />
            </ClientOnly>
          </div>
        </div>

        <div v-if="indicators">
          <h2 class="mb-2 text-xs font-semibold uppercase tracking-wider font-mono" style="color: rgba(255,0,118,0.65);">기술 지표</h2>
          <StockTechnicalIndicators />
        </div>

        <StockAnalysisGuide v-if="analysis" />
      </template>
    </main>

    <!-- 용어 모달 -->
    <GlossaryModal />
  </div>
</template>
