// plugins/apexcharts.client.ts
// .client.ts 접미사 = Nuxt가 자동으로 클라이언트에서만 로드
// 이렇게 하면 SSR 시 "window is not defined" 에러를 막을 수 있어요

import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts)
})
