// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',
  devtools: { enabled: true },

  typescript: {
    strict: true,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },

  runtimeConfig: {
    // 서버 전용 (클라이언트에 노출 안 됨)
    alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || '',
    // 클라이언트에서도 접근 가능
    public: {
      appName: 'Stock Slate',
      defaultTicker: '005930.KS', // 삼성전자 (기본값)
    },
  },

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  app: {
    head: {
      title: 'Stock Slate - 주린이 주식 대시보드',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '주린이를 위한 실전 주식 학습 대시보드' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
