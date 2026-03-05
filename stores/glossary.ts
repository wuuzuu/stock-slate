// stores/glossary.ts
// 용어 사전과 모달 상태를 관리하는 Pinia 스토어

import { defineStore } from 'pinia'
import type { GlossaryStoreState, GlossaryTerm } from '~/types/stock'
import { glossaryData } from '~/data/glossary'

export const useGlossaryStore = defineStore('glossary', {
  state: (): GlossaryStoreState => ({
    terms: glossaryData,      // glossary.ts의 용어 사전 데이터
    activeTermKey: null,      // 현재 열린 모달의 용어 키
    isModalOpen: false,       // 용어 상세 모달 표시 여부
  }),

  getters: {
    /** 현재 활성화된 용어 객체 */
    activeTerm: (state): GlossaryTerm | null => {
      if (!state.activeTermKey) return null
      return state.terms[state.activeTermKey] ?? null
    },

    /** 특정 키의 용어가 사전에 있는지 확인 */
    hasTerm:
      (state) =>
      (key: string): boolean =>
        key in state.terms,
  },

  actions: {
    /** 용어 상세 모달 열기 */
    openModal(termKey: string) {
      this.activeTermKey = termKey
      this.isModalOpen = true
    },

    /** 용어 상세 모달 닫기 */
    closeModal() {
      this.isModalOpen = false
      // 모달 닫히는 애니메이션 후에 term 클리어
      setTimeout(() => {
        this.activeTermKey = null
      }, 300)
    },

    /** 특정 용어 객체 가져오기 */
    getTerm(key: string): GlossaryTerm | null {
      return this.terms[key] ?? null
    },
  },
})
