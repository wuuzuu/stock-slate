<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <div
      class="animate-spin rounded-full"
      :class="{
        'h-5 w-5 border-2': size === 'sm',
        'h-8 w-8 border-2': !size || size === 'md',
        'h-12 w-12 border-[3px]': size === 'lg',
      }"
      style="border-color: rgba(255,0,118,0.12); border-top-color: #FF0076; box-shadow: 0 0 12px rgba(255,0,118,0.3);"
    />
    <p v-if="message" class="text-xs font-mono animate-pulse-soft" style="color: rgba(255,0,118,0.5); letter-spacing: 0.12em;">
      {{ message.toUpperCase().replace(/ /g, '_') }}
    </p>
  </div>
</template>
