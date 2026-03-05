<script setup lang="ts">
// PopularStocksGrid.vue
// 홈 화면 인기 종목 그리드 (국내 + 미국)

import type { QuoteSummary } from '~/types/stock'

const props = defineProps<{
  domestic: Array<QuoteSummary | null>
  us: Array<QuoteSummary | null>
  loading: boolean
}>()

const router = useRouter()

// 국내 종목 한국어 이름 매핑 (Naver에서 오면 이미 한국어로 오지만 fallback)
const KR_NAMES: Record<string, string> = {
  '005930.KS': '삼성전자',
  '000660.KS': 'SK하이닉스',
  '005380.KS': '현대차',
  '035420.KS': 'NAVER',
  '035720.KS': '카카오',
}

function getDisplayName(item: QuoteSummary): string {
  return KR_NAMES[item.symbol] ?? item.name
}

function formatPrice(item: QuoteSummary): string {
  if (item.price == null) return 'N/A'
  if (item.currency === 'KRW') {
    return item.price.toLocaleString('ko-KR') + '원'
  }
  return '$' + item.price.toFixed(2)
}

function formatChange(pct: number): string {
  if (pct == null || isNaN(pct)) return 'N/A'
  return (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%'
}

function goToStock(symbol: string) {
  router.push('/stock/' + symbol)
}
</script>

<template>
  <div class="space-y-4">
    <!-- 국내 주요 종목 -->
    <div>
      <p class="section-label mb-2.5">
        <span style="color: rgba(255,0,118,0.65);">KR</span>
        <span class="ml-2">국내 주요 종목</span>
      </p>

      <!-- 로딩 -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div
          v-for="n in 5"
          :key="n"
          class="p-3 animate-pulse"
          style="background: rgba(255,0,118,0.03); border: 1px solid rgba(255,0,118,0.08);"
        >
          <div class="h-2.5 w-12 mb-2" style="background: rgba(255,0,118,0.1);"></div>
          <div class="h-4 w-16 mb-1.5" style="background: rgba(255,0,118,0.08);"></div>
          <div class="h-3 w-10" style="background: rgba(255,0,118,0.06);"></div>
        </div>
      </div>

      <!-- 데이터 -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <button
          v-for="(item, i) in domestic"
          :key="i"
          class="p-3 text-left transition-all duration-150 group"
          :style="item ? 'background: rgba(255,0,118,0.03); border: 1px solid rgba(255,0,118,0.1);' : 'background: transparent; border: 1px solid rgba(255,0,118,0.05); opacity: 0.4;'"
          @click="item && goToStock(item.symbol)"
          @mouseenter="($event.currentTarget as HTMLElement).style.cssText = 'background: rgba(255,0,118,0.07); border: 1px solid rgba(255,0,118,0.3); cursor: pointer;'"
          @mouseleave="($event.currentTarget as HTMLElement).style.cssText = item ? 'background: rgba(255,0,118,0.03); border: 1px solid rgba(255,0,118,0.1);' : 'background: transparent; border: 1px solid rgba(255,0,118,0.05); opacity: 0.4;'"
        >
          <template v-if="item">
            <p class="text-xs font-mono mb-1 truncate" style="color: rgba(255,0,118,0.65);">
              {{ item.symbol }}
            </p>
            <p class="text-sm font-bold mb-1.5 truncate" style="color: #E8E6F0;">
              {{ getDisplayName(item) }}
            </p>
            <p class="price-display text-sm font-bold" :style="item.changePercent >= 0 ? 'color: #39FF14;' : 'color: #FF3157;'">
              {{ formatPrice(item) }}
            </p>
            <span :class="item.changePercent >= 0 ? 'badge-up' : 'badge-down'" class="mt-1 inline-block text-xs">
              {{ formatChange(item.changePercent) }}
            </span>
          </template>
          <template v-else>
            <p class="text-xs font-mono" style="color: rgba(255,0,118,0.2);">N/A</p>
          </template>
        </button>
      </div>
    </div>

    <!-- 미국 주요 종목 -->
    <div>
      <p class="section-label mb-2.5">
        <span style="color: rgba(255,0,118,0.65);">US</span>
        <span class="ml-2">미국 주요 종목</span>
      </p>

      <!-- 로딩 -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div
          v-for="n in 5"
          :key="n"
          class="p-3 animate-pulse"
          style="background: rgba(255,0,118,0.03); border: 1px solid rgba(255,0,118,0.08);"
        >
          <div class="h-2.5 w-10 mb-2" style="background: rgba(255,0,118,0.1);"></div>
          <div class="h-4 w-14 mb-1.5" style="background: rgba(255,0,118,0.08);"></div>
          <div class="h-3 w-12" style="background: rgba(255,0,118,0.06);"></div>
        </div>
      </div>

      <!-- 데이터 -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <button
          v-for="(item, i) in us"
          :key="i"
          class="p-3 text-left transition-all duration-150"
          :style="item ? 'background: rgba(0,212,255,0.03); border: 1px solid rgba(0,212,255,0.1);' : 'background: transparent; border: 1px solid rgba(0,212,255,0.05); opacity: 0.4;'"
          @click="item && goToStock(item.symbol)"
          @mouseenter="($event.currentTarget as HTMLElement).style.cssText = 'background: rgba(0,212,255,0.07); border: 1px solid rgba(0,212,255,0.3); cursor: pointer;'"
          @mouseleave="($event.currentTarget as HTMLElement).style.cssText = item ? 'background: rgba(0,212,255,0.03); border: 1px solid rgba(0,212,255,0.1);' : 'background: transparent; border: 1px solid rgba(0,212,255,0.05); opacity: 0.4;'"
        >
          <template v-if="item">
            <p class="text-xs font-mono font-bold mb-1" style="color: rgba(0,212,255,0.5);">
              {{ item.symbol }}
            </p>
            <p class="price-display text-sm font-bold mb-1.5" :style="item.changePercent >= 0 ? 'color: #39FF14;' : 'color: #FF3157;'">
              {{ formatPrice(item) }}
            </p>
            <span :class="item.changePercent >= 0 ? 'badge-up' : 'badge-down'" class="text-xs">
              {{ formatChange(item.changePercent) }}
            </span>
          </template>
          <template v-else>
            <p class="text-xs font-mono" style="color: rgba(0,212,255,0.2);">N/A</p>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
