<script setup lang="ts">
defineProps<{
  message: string
  retryable?: boolean
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-xl p-4"
    style="background: linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(244,63,94,0.03) 100%); border: 1px solid rgba(244,63,94,0.2);"
  >
    <!-- 에러 아이콘 -->
    <div
      class="mt-0.5 shrink-0 rounded-lg p-2"
      style="background: rgba(244,63,94,0.12); color: #FB7185;"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>

    <div class="flex-1">
      <p class="text-sm font-medium" style="color: #FB7185;">{{ message }}</p>
      <button
        v-if="retryable"
        class="mt-2 text-xs font-semibold transition-all duration-150"
        style="color: #C084FC;"
        @click="emit('retry')"
      >
        다시 시도하기 →
      </button>
    </div>
  </div>
</template>
