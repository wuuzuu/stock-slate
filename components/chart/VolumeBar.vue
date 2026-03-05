<script setup lang="ts">
// VolumeBar.vue
import type { CandlestickData } from '~/types/stock'

const props = defineProps<{
  history: CandlestickData[]
  volumeAvg20?: number
}>()

const volumeSeries = computed(() => [{
  name: '거래량',
  data: props.history.map(d => ({
    x: new Date(d.date),
    y: d.volume,
    fillColor: d.close >= d.open ? 'rgba(57, 255, 20, 0.35)' : 'rgba(255, 49, 87, 0.35)',
  })),
}])

const annotations = computed(() => {
  if (!props.volumeAvg20) return {}
  return {
    yaxis: [{
      y: props.volumeAvg20,
      borderColor: '#FFAA00',
      strokeDashArray: 4,
      label: {
        text: 'AVG20',
        style: {
          color: '#FFAA00',
          background: '#0A0A10',
          fontSize: '9px',
          fontFamily: 'JetBrains Mono',
        },
      },
    }],
  }
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 120,
    background: 'transparent',
    toolbar: { show: false },
    sparkline: { enabled: false },
    animations: { enabled: false },
    theme: { mode: 'dark' },
  },

  grid: {
    borderColor: 'rgba(255, 0, 118, 0.08)',
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },

  plotOptions: {
    bar: { columnWidth: '80%', distributed: false },
  },

  dataLabels: { enabled: false },

  xaxis: {
    type: 'datetime',
    labels: {
      style: { colors: 'rgba(255, 0, 118, 0.4)', fontSize: '9px', fontFamily: 'JetBrains Mono' },
      datetimeUTC: false,
      format: 'MM/dd',
    },
    axisBorder: { color: 'rgba(255, 0, 118, 0.15)' },
    axisTicks: { color: 'rgba(255, 0, 118, 0.15)' },
  },

  yaxis: {
    labels: {
      style: { colors: 'rgba(255, 0, 118, 0.4)', fontSize: '9px', fontFamily: 'JetBrains Mono' },
      formatter: (value: number) => {
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + 'M'
        if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K'
        return value.toString()
      },
    },
  },

  tooltip: {
    theme: 'dark',
    y: { formatter: (value: number) => value.toLocaleString('ko-KR') + '주' },
  },

  annotations: annotations.value,
  colors: ['#FF0076'],
  fill: { type: 'solid', opacity: 0.7 },
}))
</script>

<template>
  <div class="w-full">
    <div class="mb-1 flex items-center gap-1" style="font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(255,0,118,0.5);">
      <GlossaryTermTooltip term="거래량">VOLUME</GlossaryTermTooltip>
    </div>

    <apexchart
      v-if="history && history.length > 0"
      type="bar"
      height="100"
      :options="chartOptions"
      :series="volumeSeries"
    />
  </div>
</template>
