<script setup lang="ts">
// GlossaryModal.vue
import { useGlossaryStore } from '~/stores/glossary'

const glossaryStore = useGlossaryStore()

const isOpen = computed(() => glossaryStore.isModalOpen)
const term = computed(() => glossaryStore.activeTerm)

function close() {
  glossaryStore.closeModal()
}

onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})

const difficultyText = computed(() => {
  switch (term.value?.difficulty) {
    case 1: return '초급'
    case 2: return '중급'
    case 3: return '고급'
    default: return ''
  }
})

const difficultyColor = computed(() => {
  switch (term.value?.difficulty) {
    case 1: return '#39FF14'
    case 2: return '#FFAA00'
    case 3: return '#FF3157'
    default: return '#E8E6F0'
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(3,3,10,0.85); backdrop-filter: blur(4px);"
        @click.self="close"
      >
        <div
          v-if="term"
          class="w-full max-w-md overflow-hidden"
          style="
            background: #0A0A10;
            border: 1px solid rgba(255,0,118,0.45);
            border-top: 2px solid #FF0076;
            box-shadow: 0 0 0 1px rgba(255,0,118,0.1), 0 24px 60px rgba(0,0,0,0.9), 0 0 30px rgba(255,0,118,0.08);
          "
          role="dialog"
          :aria-label="`${term.term} 용어 설명`"
        >
          <!-- 모달 헤더 -->
          <div class="flex items-start justify-between p-5" style="border-bottom: 1px solid rgba(255,0,118,0.12);">
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-bold text-white tracking-wider">{{ term.term }}</h2>
                <span
                  class="px-2 py-0.5 text-xs font-mono font-bold"
                  :style="`color: ${difficultyColor}; background: ${difficultyColor}18; border: 1px solid ${difficultyColor}44;`"
                >
                  {{ difficultyText }}
                </span>
              </div>
              <p class="mt-1 text-sm font-mono" style="color: rgba(255,77,166,0.65);">{{ term.koreanName }}</p>
            </div>

            <button
              class="px-2 py-1 text-xs font-bold font-mono transition-all duration-150"
              style="color: rgba(255,0,118,0.5); border: 1px solid rgba(255,0,118,0.2);"
              @click="close"
              aria-label="닫기"
            >
              [X]
            </button>
          </div>

          <!-- 모달 본문 -->
          <div class="p-5 space-y-4">
            <!-- 요약 박스 -->
            <div
              class="p-4"
              style="background: rgba(255,0,118,0.04); border: 1px solid rgba(255,0,118,0.2); border-left: 2px solid #FF0076;"
            >
              <p class="text-xs font-mono font-bold mb-2" style="color: rgba(255,0,118,0.6); letter-spacing: 0.1em;">» 한_줄_요약</p>
              <p class="text-sm leading-relaxed" style="color: #E8E6F0;">{{ term.shortExplanation }}</p>
            </div>

            <!-- 상세 설명 -->
            <div>
              <p class="mb-2 text-xs font-mono font-bold" style="color: rgba(255,0,118,0.65); letter-spacing: 0.1em;">// 상세_설명</p>
              <p class="text-sm leading-relaxed" style="color: #CBD5E1;">{{ term.fullExplanation }}</p>
            </div>

            <!-- 예시 -->
            <div
              v-if="term.example"
              class="p-3"
              style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);"
            >
              <p class="mb-1.5 text-xs font-mono font-bold" style="color: rgba(255,0,118,0.65); letter-spacing: 0.08em;">$ 예시</p>
              <p class="text-sm leading-relaxed font-mono" style="color: #CBD5E1;">{{ term.example }}</p>
            </div>

            <!-- 연관 용어 -->
            <div v-if="term.relatedTerms && term.relatedTerms.length > 0">
              <p class="mb-2 text-xs font-mono font-bold" style="color: rgba(255,0,118,0.65); letter-spacing: 0.1em;">→ 연관_용어</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="relatedKey in term.relatedTerms"
                  :key="relatedKey"
                  class="px-3 py-1 text-xs font-mono font-bold tracking-wider transition-all duration-150"
                  style="background: rgba(255,0,118,0.06); border: 1px solid rgba(255,0,118,0.3); color: #FF4DA6;"
                  @click="glossaryStore.openModal(relatedKey)"
                >
                  {{ relatedKey }}
                </button>
              </div>
            </div>
          </div>

          <!-- 모달 푸터 -->
          <div class="px-5 py-3" style="border-top: 1px solid rgba(255,0,118,0.08);">
            <p class="text-xs font-mono" style="color: rgba(255,0,118,0.2); letter-spacing: 0.05em;">
              [WARNING] 학습 목적 정보 ─ 투자 조언 아님
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
