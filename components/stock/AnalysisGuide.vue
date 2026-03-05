<script setup lang="ts">
// AnalysisGuide.vue
import { useStockStore } from '~/stores/stock'
import { useGlossaryStore } from '~/stores/glossary'

const stockStore = useStockStore()
const glossaryStore = useGlossaryStore()
const analysis = computed(() => stockStore.analysis)

function openTermModal(termKey: string) {
  glossaryStore.openModal(termKey)
}

const signalStyles = {
  positive: {
    cssClass: 'signal-positive',
    icon: '▲',
    textColor: '#39FF14',
  },
  negative: {
    cssClass: 'signal-negative',
    icon: '▼',
    textColor: '#FF3157',
  },
  warning: {
    cssClass: 'signal-warning',
    icon: '!',
    textColor: '#FFAA00',
  },
  neutral: {
    cssClass: 'signal-neutral',
    icon: '■',
    textColor: 'rgba(255,0,118,0.6)',
  },
} as const
</script>

<template>
  <div v-if="analysis" class="space-y-2">
    <!-- 요약 박스 -->
    <div class="card-accent">
      <div class="flex items-start gap-3">
        <div
          class="shrink-0 px-2 py-1 text-xs font-bold font-mono"
          style="background: rgba(255,0,118,0.1); border: 1px solid rgba(255,0,118,0.65); color: #FF0076; letter-spacing: 0.08em;"
        >
          SYS
        </div>
        <div class="flex-1">
          <p class="text-sm leading-relaxed text-white">{{ analysis.summary }}</p>
          <p class="mt-1.5 text-xs font-mono" style="color: rgba(255,0,118,0.35); letter-spacing: 0.05em;">
            {{ new Date(analysis.generatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }} 기준
            ─ 학습용 분석 ─ 투자 조언 아님
          </p>
        </div>
      </div>
    </div>

    <!-- 개별 신호 카드들 -->
    <div class="space-y-1.5">
      <div
        v-for="(signal, index) in analysis.signals"
        :key="index"
        :class="signalStyles[signal.type].cssClass"
      >
        <div class="flex items-start gap-2.5">
          <span
            class="shrink-0 text-xs font-bold font-mono mt-0.5 w-4 text-center"
            :style="{ color: signalStyles[signal.type].textColor }"
          >{{ signalStyles[signal.type].icon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm leading-relaxed" style="color: #E8E6F0;">
              {{ signal.message }}
            </p>

            <p v-if="signal.detail" class="mt-1 text-xs leading-relaxed font-mono" style="color: rgba(255,0,118,0.65);">
              {{ signal.detail }}
            </p>

            <button
              v-if="signal.termKey"
              class="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-mono tracking-wider transition-all duration-150"
              style="background: rgba(255,0,118,0.06); border: 1px solid rgba(255,0,118,0.3); color: #FF4DA6; letter-spacing: 0.08em;"
              @click="openTermModal(signal.termKey!)"
            >
              ? {{ signal.termKey }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="text-center text-xs font-mono" style="color: rgba(255,0,118,0.25); letter-spacing: 0.08em;">
      학습 목적의 참고 정보 ─ 실제 투자 결정은 전문가와 상담
    </p>
  </div>

  <div v-else class="card flex items-center justify-center py-8">
    <span class="text-sm font-mono animate-pulse-soft" style="color: rgba(255,0,118,0.65); letter-spacing: 0.12em;">ANALYZING...</span>
  </div>
</template>
