<script setup lang="ts">
// DailyTerm.vue
// 오늘의 학습 용어 - 날짜 기반으로 glossary에서 하나 선택

import { useGlossaryStore } from '~/stores/glossary'

const glossaryStore = useGlossaryStore()

// 오늘 날짜 기준으로 고정된 용어 선택
const todayTerm = computed(() => {
  const termKeys = Object.keys(glossaryStore.terms)
  if (!termKeys.length) return null
  const dayIndex = new Date().getDate() % termKeys.length
  const key = termKeys[dayIndex]
  return { key, ...glossaryStore.terms[key] }
})

const difficultyLabel = computed(() => {
  switch (todayTerm.value?.difficulty) {
    case 1: return '초급'
    case 2: return '중급'
    case 3: return '고급'
    default: return ''
  }
})

const difficultyColor = computed(() => {
  switch (todayTerm.value?.difficulty) {
    case 1: return '#39FF14'
    case 2: return '#FFAA00'
    case 3: return '#FF3157'
    default: return '#E8E6F0'
  }
})

function openModal() {
  if (todayTerm.value) {
    glossaryStore.openModal(todayTerm.value.key)
  }
}
</script>

<template>
  <div
    v-if="todayTerm"
    class="card cursor-pointer transition-all duration-150"
    style="border-left: 2px solid rgba(255,0,118,0.5);"
    @click="openModal"
    @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = '#FF0076'"
    @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,118,0.5)'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <!-- 헤더 -->
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-mono font-bold" style="color: rgba(255,0,118,0.5); letter-spacing: 0.12em;">📚 오늘의 학습 용어</span>
        </div>

        <!-- 용어명 -->
        <div class="flex items-center gap-2 mb-1.5">
          <h3 class="text-base font-bold tracking-wider" style="color: #E8E6F0;">{{ todayTerm.term }}</h3>
          <span
            class="px-1.5 py-0.5 text-xs font-mono font-bold"
            :style="`color: ${difficultyColor}; background: ${difficultyColor}18; border: 1px solid ${difficultyColor}44;`"
          >{{ difficultyLabel }}</span>
        </div>

        <!-- 한국어 이름 -->
        <p class="text-xs font-mono mb-2" style="color: rgba(255,77,166,0.55);">{{ todayTerm.koreanName }}</p>

        <!-- 짧은 설명 -->
        <p class="text-sm leading-relaxed" style="color: rgba(203,213,225,0.8);">{{ todayTerm.shortExplanation }}</p>
      </div>

      <!-- 자세히 버튼 -->
      <div class="shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold font-mono" style="background: rgba(255,0,118,0.06); border: 1px solid rgba(255,0,118,0.25); color: rgba(255,0,118,0.6);">
        자세히 →
      </div>
    </div>
  </div>
</template>
