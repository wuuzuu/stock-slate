<script setup lang="ts">
// TechnicalIndicators.vue
// 사이버펑크 스타일 스탯 바 지표

import { useStockStore } from '~/stores/stock'

const stockStore = useStockStore()
const indicators = computed(() => stockStore.indicators)
const quote = computed(() => stockStore.quote)

function formatPrice(value: number): string {
  if (!quote.value) return '--'
  if (quote.value.currency === 'KRW') {
    return value.toLocaleString('ko-KR')
  }
  return '$' + value.toFixed(2)
}

/** 현재가와 MA의 괴리율을 0~100% 바로 변환 (50% = 동일) */
function maBarPercent(currentPrice: number, maValue: number): number {
  if (isNaN(maValue) || maValue === 0) return 50
  const pct = (currentPrice - maValue) / maValue
  return Math.max(5, Math.min(95, 50 + pct * 500))
}

function maBarColor(currentPrice: number, maValue: number): string {
  return currentPrice >= maValue ? '#39FF14' : '#FF3157'
}

function maBarShadow(currentPrice: number, maValue: number): string {
  return currentPrice >= maValue
    ? '0 0 6px rgba(57,255,20,0.6)'
    : '0 0 6px rgba(255,49,87,0.6)'
}

/** RSI 바 색상 */
function rsiBarColor(signal: string): string {
  if (signal === 'overbought') return '#FF3157'
  if (signal === 'oversold') return '#39FF14'
  return '#FF0076'
}

/** 거래량 바 퍼센트 (평균 대비) */
function volBarPercent(current: number, avg: number): number {
  return Math.max(5, Math.min(95, (current / avg) * 50))
}
</script>

<template>
  <div v-if="indicators" class="space-y-3">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">

      <!-- MA5 카드 -->
      <div class="indicator-cell flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <GlossaryTermTooltip term="이동평균선">
            <span class="section-label">MA5</span>
          </GlossaryTermTooltip>
          <span
            v-if="quote && !isNaN(indicators.ma5.currentValue)"
            class="text-xs font-bold font-mono"
            :style="quote.regularMarketPrice >= indicators.ma5.currentValue
              ? 'color: #39FF14;'
              : 'color: #FF3157;'"
          >
            {{ quote.regularMarketPrice >= indicators.ma5.currentValue ? '▲ ABOVE' : '▼ BELOW' }}
          </span>
        </div>
        <p class="price-display text-sm font-bold text-white">
          {{ isNaN(indicators.ma5.currentValue) ? '--' : formatPrice(indicators.ma5.currentValue) }}
        </p>
        <!-- 스탯 바 -->
        <div v-if="quote && !isNaN(indicators.ma5.currentValue)" class="stat-bar-track">
          <div
            :style="{
              height: '100%',
              width: maBarPercent(quote.regularMarketPrice, indicators.ma5.currentValue) + '%',
              background: maBarColor(quote.regularMarketPrice, indicators.ma5.currentValue),
              boxShadow: maBarShadow(quote.regularMarketPrice, indicators.ma5.currentValue),
              transition: 'width 0.4s ease',
            }"
          />
        </div>
        <p class="text-xs" style="color: rgba(255,0,118,0.35); letter-spacing: 0.08em;">5일 이동평균</p>
      </div>

      <!-- MA20 카드 -->
      <div class="indicator-cell flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <GlossaryTermTooltip term="이동평균선">
            <span class="section-label">MA20</span>
          </GlossaryTermTooltip>
          <span
            v-if="quote && !isNaN(indicators.ma20.currentValue)"
            class="text-xs font-bold font-mono"
            :style="quote.regularMarketPrice >= indicators.ma20.currentValue
              ? 'color: #39FF14;'
              : 'color: #FF3157;'"
          >
            {{ quote.regularMarketPrice >= indicators.ma20.currentValue ? '▲ ABOVE' : '▼ BELOW' }}
          </span>
        </div>
        <p class="price-display text-sm font-bold text-white">
          {{ isNaN(indicators.ma20.currentValue) ? '--' : formatPrice(indicators.ma20.currentValue) }}
        </p>
        <div v-if="quote && !isNaN(indicators.ma20.currentValue)" class="stat-bar-track">
          <div
            :style="{
              height: '100%',
              width: maBarPercent(quote.regularMarketPrice, indicators.ma20.currentValue) + '%',
              background: maBarColor(quote.regularMarketPrice, indicators.ma20.currentValue),
              boxShadow: maBarShadow(quote.regularMarketPrice, indicators.ma20.currentValue),
              transition: 'width 0.4s ease',
            }"
          />
        </div>
        <p class="text-xs" style="color: rgba(255,0,118,0.35); letter-spacing: 0.08em;">20일 이동평균</p>
      </div>

      <!-- RSI 카드 -->
      <div class="indicator-cell flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <GlossaryTermTooltip term="RSI">
            <span class="section-label">RSI</span>
          </GlossaryTermTooltip>
          <span
            class="text-xs font-bold font-mono"
            :style="indicators.rsi14.signal === 'overbought'
              ? 'color: #FF3157;'
              : indicators.rsi14.signal === 'oversold'
                ? 'color: #39FF14;'
                : 'color: rgba(232,230,240,0.4);'"
          >
            {{ indicators.rsi14.signal === 'overbought' ? '과매수' : indicators.rsi14.signal === 'oversold' ? '과매도' : '중립' }}
          </span>
        </div>
        <p
          class="price-display text-sm font-bold"
          :style="{
            color: indicators.rsi14.signal === 'overbought' ? '#FF3157'
              : indicators.rsi14.signal === 'oversold' ? '#39FF14'
              : '#E8E6F0'
          }"
        >
          {{ isNaN(indicators.rsi14.currentValue) ? '--' : indicators.rsi14.currentValue.toFixed(1) }}
        </p>
        <div v-if="!isNaN(indicators.rsi14.currentValue)" class="stat-bar-track">
          <div
            :style="{
              height: '100%',
              width: Math.min(indicators.rsi14.currentValue, 100) + '%',
              background: rsiBarColor(indicators.rsi14.signal),
              boxShadow: `0 0 6px ${indicators.rsi14.signal === 'overbought' ? 'rgba(255,49,87,0.6)' : indicators.rsi14.signal === 'oversold' ? 'rgba(57,255,20,0.6)' : 'rgba(255,0,118,0.6)'}`,
              transition: 'width 0.4s ease',
            }"
          />
        </div>
        <p class="text-xs" style="color: rgba(255,0,118,0.35); letter-spacing: 0.08em;">상대강도지수</p>
      </div>

      <!-- 거래량 카드 -->
      <div class="indicator-cell flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <GlossaryTermTooltip term="거래량">
            <span class="section-label">거래량</span>
          </GlossaryTermTooltip>
          <span
            v-if="quote"
            class="text-xs font-bold font-mono"
            :style="quote.regularMarketVolume > indicators.volumeAvg20 * 1.5
              ? 'color: #FFAA00;'
              : 'color: rgba(232,230,240,0.35);'"
          >
            {{ (quote.regularMarketVolume / indicators.volumeAvg20).toFixed(1) }}x
          </span>
        </div>
        <p class="price-display text-sm font-bold text-white">
          {{ quote
            ? (quote.regularMarketVolume >= 100000000
                ? (quote.regularMarketVolume / 100000000).toFixed(1) + '억'
                : (quote.regularMarketVolume / 10000).toFixed(0) + '만') + '주'
            : '--' }}
        </p>
        <div v-if="quote" class="stat-bar-track">
          <div
            :style="{
              height: '100%',
              width: volBarPercent(quote.regularMarketVolume, indicators.volumeAvg20) + '%',
              background: quote.regularMarketVolume > indicators.volumeAvg20 * 1.5 ? '#FFAA00' : '#FF0076',
              boxShadow: quote.regularMarketVolume > indicators.volumeAvg20 * 1.5 ? '0 0 6px rgba(255,170,0,0.6)' : '0 0 6px rgba(255,0,118,0.6)',
              transition: 'width 0.4s ease',
            }"
          />
        </div>
        <p class="text-xs" style="color: rgba(255,0,118,0.35); letter-spacing: 0.08em;">오늘 거래량</p>
      </div>
    </div>

    <!-- 골든/데드크로스 알림 -->
    <div
      v-if="indicators.goldenCross || indicators.deadCross"
      class="flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-wider"
      :style="indicators.goldenCross
        ? 'background: rgba(57,255,20,0.05); border: 1px solid rgba(57,255,20,0.3); border-left: 2px solid #39FF14; color: #39FF14;'
        : 'background: rgba(255,49,87,0.05); border: 1px solid rgba(255,49,87,0.3); border-left: 2px solid #FF3157; color: #FF3157;'"
    >
      <span>{{ indicators.goldenCross ? '★' : '✕' }}</span>
      <span>
        <GlossaryTermTooltip :term="indicators.goldenCross ? '골든크로스' : '데드크로스'">
          {{ indicators.goldenCross ? '골든크로스' : '데드크로스' }}
        </GlossaryTermTooltip>
        {{ indicators.goldenCross ? ' ─ 5일선이 20일선을 위로 돌파' : ' ─ 5일선이 20일선 아래로 하락' }}
      </span>
    </div>
  </div>
</template>
