<script setup lang="ts">
// WatchlistPanel.vue
import { useWatchlistStore } from '~/stores/watchlist'
import { useStockStore } from '~/stores/stock'

const watchlistStore = useWatchlistStore()
const stockStore = useStockStore()

const emit = defineEmits<{
  selectStock: [ticker: string]
}>()

const items = computed(() => watchlistStore.items)
const currentTicker = computed(() => stockStore.currentTicker)

function selectStock(ticker: string) {
  emit('selectStock', ticker)
}

function removeStock(ticker: string, event: MouseEvent) {
  event.stopPropagation()
  watchlistStore.removeFromWatchlist(ticker)
}

const quickPickTickers = [
  { symbol: '005930.KS', name: '삼성전자' },
  { symbol: '000660.KS', name: 'SK하이닉스' },
  { symbol: 'AAPL', name: '애플' },
  { symbol: 'MSFT', name: '마이크로소프트' },
]
</script>

<template>
  <div class="card flex flex-col gap-3 h-full">
    <!-- 패널 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span style="color: #FF0076; font-size: 0.7rem; letter-spacing: 0.15em;">★ WATCHLIST</span>
      </div>
      <span
        class="px-2 py-0.5 text-xs font-mono font-bold"
        style="background: rgba(255,0,118,0.08); border: 1px solid rgba(255,0,118,0.3); color: #FF4DA6;"
      >
        {{ items.length }}
      </span>
    </div>

    <hr class="divider" />

    <!-- 관심종목 목록 -->
    <div v-if="items.length > 0" class="space-y-0.5 overflow-y-auto">
      <button
        v-for="item in items"
        :key="item.ticker"
        class="group flex w-full items-center justify-between px-2 py-2 text-left transition-all duration-100"
        :style="currentTicker === item.ticker
          ? 'background: rgba(255,0,118,0.08); border-left: 2px solid #FF0076;'
          : 'border-left: 2px solid transparent;'"
        @click="selectStock(item.ticker)"
      >
        <div class="min-w-0 flex items-center gap-2">
          <span
            class="text-xs font-bold shrink-0"
            :style="currentTicker === item.ticker ? 'color: #FF0076;' : 'color: rgba(255,0,118,0.25);'"
          >▸</span>
          <div class="min-w-0">
            <p
              class="text-sm truncate font-bold"
              :style="currentTicker === item.ticker ? 'color: #FF4DA6;' : 'color: #E8E6F0;'"
            >
              {{ item.name || item.ticker }}
            </p>
            <p class="text-xs font-mono mt-0.5 truncate" style="color: rgba(255,0,118,0.65);">
              {{ item.ticker }}
            </p>
          </div>
        </div>

        <!-- 제거 버튼 -->
        <div
          role="button"
          tabindex="0"
          class="ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity px-1 cursor-pointer text-xs font-bold"
          style="color: rgba(255,49,87,0.6);"
          @click="removeStock(item.ticker, $event)"
          @keydown.enter="removeStock(item.ticker, $event as unknown as MouseEvent)"
          aria-label="관심종목에서 제거"
        >
          ✕
        </div>
      </button>
    </div>

    <!-- 관심종목 없을 때 -->
    <div v-else class="flex flex-col gap-3">
      <p class="text-center text-xs leading-relaxed py-1" style="color: rgba(255,0,118,0.65); letter-spacing: 0.05em;">
        관심종목이 없어요<br>
        <span style="color: rgba(255,0,118,0.25);">종목 검색 후 ★ 추가</span>
      </p>

      <div>
        <p class="section-label mb-2">추천 종목</p>
        <div class="space-y-0.5">
          <button
            v-for="pick in quickPickTickers"
            :key="pick.symbol"
            class="flex w-full items-center gap-2 px-2 py-1.5 text-left transition-all duration-100"
            style="border-left: 2px solid transparent;"
            @mouseenter="($event.currentTarget as HTMLElement).style.cssText = 'border-left: 2px solid rgba(255,0,118,0.65); background: rgba(255,0,118,0.04);'"
            @mouseleave="($event.currentTarget as HTMLElement).style.cssText = 'border-left: 2px solid transparent; background: transparent;'"
            @click="selectStock(pick.symbol)"
          >
            <span class="text-xs" style="color: rgba(255,0,118,0.5);">▸</span>
            <div>
              <p class="text-sm" style="color: rgba(232,230,240,0.7);">{{ pick.name }}</p>
              <p class="text-xs font-mono" style="color: rgba(255,0,118,0.35);">{{ pick.symbol }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
