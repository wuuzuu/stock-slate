<script setup lang="ts">
// CandlestickChart.vue
import type { CandlestickData, TechnicalIndicators } from '~/types/stock'

const props = defineProps<{
  history: CandlestickData[]
  indicators?: TechnicalIndicators | null
  currency?: string
}>()

const candleSeries = computed(() => [{
  name: '주가',
  data: props.history.map(d => ({
    x: new Date(d.date),
    y: [d.open, d.high, d.low, d.close],
  })),
}])

const maSeries = computed(() => {
  if (!props.indicators) return []
  const series = []

  if (props.indicators.ma5.values.length > 0) {
    series.push({
      name: 'MA5',
      type: 'line',
      data: props.indicators.ma5.values.map(v => ({
        x: new Date(v.date),
        y: Number(v.value.toFixed(0)),
      })),
    })
  }

  if (props.indicators.ma20.values.length > 0) {
    series.push({
      name: 'MA20',
      type: 'line',
      data: props.indicators.ma20.values.map(v => ({
        x: new Date(v.date),
        y: Number(v.value.toFixed(0)),
      })),
    })
  }

  return series
})

const allSeries = computed(() => [
  ...candleSeries.value,
  ...maSeries.value,
])

function formatPrice(value: number) {
  if (props.currency === 'KRW' || !props.currency) {
    return value.toLocaleString('ko-KR') + '원'
  }
  return '$' + value.toFixed(2)
}

const chartOptions = computed(() => ({
  chart: {
    type: 'candlestick',
    height: 350,
    background: 'transparent',
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
    },
    animations: { enabled: true, speed: 400 },
    theme: { mode: 'dark' },
  },

  theme: { mode: 'dark' },

  grid: {
    borderColor: 'rgba(255, 0, 118, 0.18)',
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },

  plotOptions: {
    candlestick: {
      colors: {
        upward: '#39FF14',
        downward: '#FF3157',
      },
      wick: { useFillColor: true },
    },
  },

  colors: ['#39FF14', '#FFAA00', '#00D4FF'],

  stroke: {
    width: [1, 1.5, 1.5],
    curve: 'smooth',
  },

  xaxis: {
    type: 'datetime',
    labels: {
      style: { colors: 'rgba(255, 0, 118, 0.45)', fontSize: '10px', fontFamily: 'JetBrains Mono' },
      datetimeUTC: false,
      format: 'MM/dd',
    },
    axisBorder: { color: 'rgba(255, 0, 118, 0.15)' },
    axisTicks: { color: 'rgba(255, 0, 118, 0.15)' },
  },

  yaxis: {
    tooltip: { enabled: true },
    labels: {
      style: { colors: 'rgba(255, 0, 118, 0.45)', fontSize: '10px', fontFamily: 'JetBrains Mono' },
      formatter: (value: number) => {
        if (props.currency === 'KRW' || !props.currency) {
          return value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value.toFixed(0)
        }
        return '$' + value.toFixed(0)
      },
    },
  },

  tooltip: {
    theme: 'dark',
    custom: ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: Record<string, unknown> }) => {
      if (seriesIndex !== 0) return ''

      const data = (w.globals as { initialSeries: Array<{ data: Array<{ x: Date; y: number[] }> }> }).initialSeries[0].data[dataPointIndex]
      if (!data) return ''

      const [open, high, low, close] = data.y
      const date = new Date(data.x)
      const isUp = close >= open

      return `
        <div style="padding:10px 12px;background:#0A0A10;border:1px solid rgba(255,0,118,0.65);font-family:'JetBrains Mono',monospace;">
          <div style="color:rgba(255,0,118,0.6);font-size:10px;letter-spacing:0.1em;margin-bottom:6px;">
            ${date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </div>
          <div style="color:${isUp ? '#39FF14' : '#FF3157'};font-size:14px;font-weight:700;margin-bottom:6px;text-shadow:0 0 8px ${isUp ? 'rgba(57,255,20,0.5)' : 'rgba(255,49,87,0.5)'};">
            ${formatPrice(close)}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;font-size:10px;color:rgba(255,0,118,0.65);">
            <span>시가</span><span style="color:#E8E6F0">${formatPrice(open)}</span>
            <span>고가</span><span style="color:#39FF14">${formatPrice(high)}</span>
            <span>저가</span><span style="color:#FF3157">${formatPrice(low)}</span>
            <span>종가</span><span style="color:#E8E6F0">${formatPrice(close)}</span>
          </div>
        </div>
      `
    },
  },

  legend: {
    show: true,
    labels: { colors: 'rgba(255, 0, 118, 0.6)' },
    markers: { width: 8, height: 2, radius: 0 },
    itemMargin: { horizontal: 8 },
    fontFamily: 'JetBrains Mono',
    fontSize: '10px',
  },
}))
</script>

<template>
  <div class="w-full">
    <div v-if="!history || history.length === 0" class="flex h-64 items-center justify-center" style="color: rgba(255,0,118,0.65); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em;">
      LOADING_CHART_DATA...
    </div>

    <apexchart
      v-else
      type="candlestick"
      height="350"
      :options="chartOptions"
      :series="allSeries"
    />
  </div>
</template>
