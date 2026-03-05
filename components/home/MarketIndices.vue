<script setup lang="ts">
// MarketIndices.vue
// 홈 화면 시장 지수 바 (KOSPI, KOSDAQ, S&P500, NASDAQ)

import type { QuoteSummary } from '~/types/stock'

const props = defineProps<{
  indices: Array<QuoteSummary | null>
  loading: boolean
}>()

const INDEX_LABELS: Record<string, string> = {
  '^KS11': 'KOSPI',
  '^KQ11': 'KOSDAQ',
  '^SPX': 'S&P 500',
  '^NDQ': 'NASDAQ',
}

function getLabel(item: QuoteSummary): string {
  return INDEX_LABELS[item.symbol] ?? item.symbol
}

function formatPrice(item: QuoteSummary): string {
  if (item.price == null) return 'N/A'
  if (item.currency === 'KRW') {
    return item.price.toLocaleString('ko-KR')
  }
  return item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatChange(pct: number): string {
  if (pct == null || isNaN(pct)) return 'N/A'
  return (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%'
}
</script>

<template>
  <!-- 로딩 스켈레톤 -->
  <div v-if="loading" class="flex gap-2 overflow-x-auto pb-1">
    <div
      v-for="n in 4"
      :key="n"
      class="flex-1 min-w-[120px] px-4 py-3 animate-pulse"
      style="background: rgba(255,0,118,0.04); border: 1px solid rgba(255,0,118,0.1);"
    >
      <div class="h-2.5 w-16 mb-2" style="background: rgba(255,0,118,0.12);"></div>
      <div class="h-4 w-20 mb-1" style="background: rgba(255,0,118,0.08);"></div>
      <div class="h-2.5 w-12" style="background: rgba(255,0,118,0.06);"></div>
    </div>
  </div>

  <!-- 지수 데이터 -->
  <div v-else class="flex gap-2 overflow-x-auto pb-1">
    <template v-for="(item, i) in indices" :key="i">
      <!-- 데이터 있음 -->
      <div
        v-if="item"
        class="flex-1 min-w-[120px] px-4 py-3 transition-all duration-150"
        :style="item.changePercent >= 0
          ? 'background: rgba(57,255,20,0.03); border: 1px solid rgba(57,255,20,0.15);'
          : 'background: rgba(255,49,87,0.03); border: 1px solid rgba(255,49,87,0.15);'"
      >
        <p class="text-xs font-bold font-mono tracking-wider mb-1" style="color: rgba(255,0,118,0.5);">
          {{ getLabel(item) }}
        </p>
        <p
          class="price-display text-base font-bold"
          :style="item.changePercent >= 0 ? 'color: #39FF14;' : 'color: #FF3157;'"
        >
          {{ formatPrice(item) }}
        </p>
        <p
          class="text-xs font-mono font-bold mt-0.5"
          :style="item.changePercent >= 0 ? 'color: rgba(57,255,20,0.7);' : 'color: rgba(255,49,87,0.7);'"
        >
          {{ item.changePercent >= 0 ? '▲' : '▼' }} {{ formatChange(item.changePercent) }}
        </p>
      </div>

      <!-- 데이터 없음 (에러) -->
      <div
        v-else
        class="flex-1 min-w-[120px] px-4 py-3 flex items-center justify-center"
        style="background: rgba(255,0,118,0.02); border: 1px solid rgba(255,0,118,0.08);"
      >
        <span class="text-xs font-mono" style="color: rgba(255,0,118,0.25);">N/A</span>
      </div>
    </template>
  </div>
</template>
