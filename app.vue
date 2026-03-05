<template>
  <div class="min-h-screen bg-navy-900 text-slate-100">
    <!-- 페이지 이동 시 상단 진행 바 -->
    <NuxtLoadingIndicator
      color="#FF0076"
      :height="2"
      :duration="3000"
      :throttle="0"
    />
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </div>
</template>
