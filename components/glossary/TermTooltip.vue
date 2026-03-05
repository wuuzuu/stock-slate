<script setup lang="ts">
// TermTooltip.vue
import { useGlossaryStore } from '~/stores/glossary'

const props = defineProps<{
  term: string
}>()

const glossaryStore = useGlossaryStore()
const isTooltipVisible = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)

const termData = computed(() => glossaryStore.getTerm(props.term))

function openModal() {
  if (termData.value) {
    glossaryStore.openModal(props.term)
  }
}

function showTooltip() {
  if (termData.value) isTooltipVisible.value = true
}

function hideTooltip() {
  isTooltipVisible.value = false
}
</script>

<template>
  <span class="relative inline-block">
    <span
      v-if="termData"
      class="term-highlight"
      role="button"
      tabindex="0"
      :aria-label="`${term} 용어 설명 보기`"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
      @click="openModal"
      @keydown.enter="openModal"
    >
      <slot />
      <sup class="ml-0.5 opacity-80" style="color: #FF0076; font-size: 0.6em;">?</sup>
    </span>

    <span v-else><slot /></span>

    <!-- 호버 툴팁 -->
    <Transition
      enter-active-class="transition-all duration-150"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isTooltipVisible && termData"
        ref="tooltipRef"
        class="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 p-3 overflow-hidden"
        style="background: #0A0A10; border: 1px solid rgba(255,0,118,0.45); border-top: 2px solid #FF0076; box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 20px rgba(255,0,118,0.08);"
        role="tooltip"
      >
        <!-- 용어명 + 이름 -->
        <div class="mb-2">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-sm font-mono" style="color: #FF4DA6;">{{ termData.term }}</span>
            <span class="text-xs shrink-0">
              <span v-for="i in 3" :key="i" :class="i <= termData.difficulty ? 'text-yellow-400' : 'text-slate-700'">★</span>
            </span>
          </div>
          <span class="text-xs font-mono" style="color: rgba(255,0,118,0.65);">{{ termData.koreanName }}</span>
        </div>

        <p class="text-xs leading-relaxed" style="color: #CBD5E1;">{{ termData.shortExplanation }}</p>

        <p class="mt-2 text-xs font-mono" style="color: rgba(255,0,118,0.65); letter-spacing: 0.05em;">클릭 → 상세 설명 →</p>

        <!-- 화살표 -->
        <div
          class="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45"
          style="background: #0A0A10; border-bottom: 1px solid rgba(255,0,118,0.45); border-right: 1px solid rgba(255,0,118,0.45);"
        />
      </div>
    </Transition>
  </span>
</template>
