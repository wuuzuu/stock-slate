<script setup lang="ts">
// StockHeader.vue
import { useStockStore } from '~/stores/stock'
import { useWatchlistStore } from '~/stores/watchlist'

const stockStore = useStockStore()
const watchlistStore = useWatchlistStore()

const quote = computed(() => stockStore.quote)
const isUp = computed(() => stockStore.isUp)
const isDown = computed(() => stockStore.isDown)
const formattedPrice = computed(() => stockStore.formattedPrice)
const changePercent = computed(() => stockStore.changePercentDisplay)
const changeAmount = computed(() => stockStore.changeDisplay)

const isInWatchlist = computed(() =>
  quote.value ? watchlistStore.isInWatchlist(quote.value.symbol) : false,
)

function toggleWatchlist() {
  if (!quote.value) return
  if (isInWatchlist.value) {
    watchlistStore.removeFromWatchlist(quote.value.symbol)
  }
  else {
    watchlistStore.addToWatchlist(quote.value.symbol, quote.value.shortName)
  }
}

function formatMarketCap(cap: number, currency: string): string {
  if (currency === 'KRW') {
    if (cap >= 1_0000_0000_0000) return (cap / 1_0000_0000_0000).toFixed(1) + '조'
    if (cap >= 1_0000_0000) return (cap / 1_0000_0000).toFixed(0) + '억'
    return cap.toLocaleString('ko-KR')
  }
  if (cap >= 1_000_000_000_000) return '$' + (cap / 1_000_000_000_000).toFixed(2) + 'T'
  if (cap >= 1_000_000_000) return '$' + (cap / 1_000_000_000).toFixed(1) + 'B'
  return '$' + (cap / 1_000_000).toFixed(0) + 'M'
}
</script>

<template>
  <div v-if="quote" class="card">
    <div class="flex items-start justify-between gap-4">
      <!-- 왼쪽 -->
      <div class="min-w-0 flex-1">

        <!-- 종목명 + 티커 + 거래소 -->
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-lg font-bold text-white tracking-wider">{{ quote.shortName }}</h1>
          <span
            class="px-2 py-0.5 text-xs font-mono tracking-wider font-bold"
            style="background: rgba(255,0,118,0.08); border: 1px solid rgba(255,0,118,0.65); color: #FF4DA6;"
          >
            {{ quote.symbol }}
          </span>
          <span
            class="px-1.5 py-0.5 text-xs font-mono"
            style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: rgba(232,230,240,0.3);"
          >
            {{ quote.exchange }}
          </span>
          <div class="flex items-center gap-1.5">
            <span class="live-dot"></span>
            <span class="text-xs font-bold" style="color: #39FF14; letter-spacing: 0.12em;">LIVE</span>
          </div>
        </div>

        <!-- 현재 가격 -->
        <div class="mt-3 flex items-baseline gap-3 flex-wrap">
          <span
            class="price-display text-4xl font-bold"
            :style="{
              color: isUp ? '#39FF14' : isDown ? '#FF3157' : '#E8E6F0',
              textShadow: isUp
                ? '0 0 20px rgba(57,255,20,0.5)'
                : isDown
                  ? '0 0 20px rgba(255,49,87,0.5)'
                  : 'none'
            }"
          >
            {{ formattedPrice }}
          </span>

          <div class="flex items-center gap-2">
            <span
              class="price-display text-sm font-bold"
              :style="{ color: isUp ? '#39FF14' : isDown ? '#FF3157' : '#8888A0' }"
            >
              {{ changeAmount }}
            </span>
            <span :class="{ 'badge-up': isUp, 'badge-down': isDown, 'badge-neutral': !isUp && !isDown }">
              {{ changePercent }}
            </span>
          </div>
        </div>

        <!-- 부가 정보 행 -->
        <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1.5" style="font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em;">
          <span class="flex items-center gap-1.5">
            <span style="color: rgba(255,0,118,0.45);">시가</span>
            <span style="color: rgba(232,230,240,0.65);">{{ quote.regularMarketOpen.toLocaleString('ko-KR') }}</span>
          </span>
          <span class="flex items-center gap-1.5">
            <span style="color: rgba(255,0,118,0.45);">고가</span>
            <span style="color: #39FF14;">{{ quote.regularMarketDayHigh.toLocaleString('ko-KR') }}</span>
          </span>
          <span class="flex items-center gap-1.5">
            <span style="color: rgba(255,0,118,0.45);">저가</span>
            <span style="color: #FF3157;">{{ quote.regularMarketDayLow.toLocaleString('ko-KR') }}</span>
          </span>
          <span class="flex items-center gap-1.5">
            <span style="color: rgba(255,0,118,0.45);">전일</span>
            <span style="color: rgba(232,230,240,0.45);">{{ quote.regularMarketPreviousClose.toLocaleString('ko-KR') }}</span>
          </span>
          <span v-if="quote.marketCap" class="flex items-center gap-1.5">
            <span style="color: rgba(255,0,118,0.45);"><GlossaryTermTooltip term="시가총액">시총</GlossaryTermTooltip></span>
            <span style="color: rgba(232,230,240,0.65);">{{ formatMarketCap(quote.marketCap, quote.currency) }}</span>
          </span>
          <span v-if="quote.trailingPE" class="flex items-center gap-1.5">
            <span style="color: rgba(255,0,118,0.45);"><GlossaryTermTooltip term="PER">PER</GlossaryTermTooltip></span>
            <span style="color: rgba(232,230,240,0.65);">{{ quote.trailingPE.toFixed(1) }}</span>
          </span>
        </div>
      </div>

      <!-- 오른쪽: 관심종목 버튼 -->
      <button
        class="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-widest transition-all duration-150"
        :style="isInWatchlist
          ? 'background: rgba(255,170,0,0.08); border: 1px solid rgba(255,170,0,0.5); color: #FFAA00; box-shadow: 0 0 12px rgba(255,170,0,0.1);'
          : 'background: rgba(255,0,118,0.04); border: 1px solid rgba(255,0,118,0.2); color: rgba(255,0,118,0.65);'"
        @click="toggleWatchlist"
      >
        <span>{{ isInWatchlist ? '★' : '☆' }}</span>
        <span class="hidden sm:inline">{{ isInWatchlist ? 'WATCHING' : 'WATCH' }}</span>
      </button>
    </div>
  </div>
</template>
