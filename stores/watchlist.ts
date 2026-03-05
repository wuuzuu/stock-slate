// stores/watchlist.ts
// 관심종목 목록을 관리하는 Pinia 스토어
// localStorage에 저장해서 새로고침해도 유지돼요

import { defineStore } from 'pinia'
import type { WatchlistItem, WatchlistStoreState } from '~/types/stock'

export const useWatchlistStore = defineStore('watchlist', {
  state: (): WatchlistStoreState => ({
    items: [],
  }),

  getters: {
    /** 관심종목 티커 목록 */
    tickers: (state): string[] => state.items.map(i => i.ticker),

    /** 특정 종목이 관심종목에 있는지 확인 */
    isInWatchlist:
      (state) =>
      (ticker: string): boolean =>
        state.items.some(i => i.ticker === ticker),

    /** 관심종목 수 */
    count: (state): number => state.items.length,
  },

  actions: {
    /** 관심종목 추가 */
    addToWatchlist(ticker: string, name?: string, note?: string) {
      if (!this.isInWatchlist(ticker)) {
        this.items.push({
          ticker: ticker.toUpperCase(),
          name,
          addedAt: new Date().toISOString(),
          note,
        })
        this.persist()
      }
    },

    /** 관심종목 제거 */
    removeFromWatchlist(ticker: string) {
      this.items = this.items.filter(i => i.ticker !== ticker.toUpperCase())
      this.persist()
    },

    /** 메모 업데이트 */
    updateNote(ticker: string, note: string) {
      const item = this.items.find(i => i.ticker === ticker.toUpperCase())
      if (item) {
        item.note = note
        this.persist()
      }
    },

    /** localStorage에 저장 (클라이언트 전용) */
    persist() {
      if (import.meta.client) {
        localStorage.setItem('stock-slate-watchlist', JSON.stringify(this.items))
      }
    },

    /**
     * localStorage에서 복원 (앱 시작 시 호출)
     * app.vue나 pages/index.vue의 onMounted에서 호출해요
     */
    hydrate() {
      if (import.meta.client) {
        const stored = localStorage.getItem('stock-slate-watchlist')
        if (stored) {
          try {
            this.items = JSON.parse(stored) as WatchlistItem[]
          }
          catch {
            this.items = []
          }
        }
      }
    },
  },
})
