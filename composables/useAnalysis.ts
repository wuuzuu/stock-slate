// composables/useAnalysis.ts
// 주가 데이터를 분석해서 주린이가 이해할 수 있는 한국어 해설을 생성해요
// "지금 7만원은 전일 대비 2% 올랐는데, 이건 5일 이동평균선 위에 있어서 흐름이 좋아요!"

import type {
  StockQuote,
  TechnicalIndicators,
  AnalysisSignal,
  StockAnalysis,
} from '~/types/stock'

export function useAnalysis() {
  /**
   * 주가와 기술 지표를 바탕으로 교육용 분석 신호들을 생성해요
   */
  function generateSignals(
    quote: StockQuote,
    indicators: TechnicalIndicators,
  ): AnalysisSignal[] {
    const signals: AnalysisSignal[] = []
    const { regularMarketChangePercent: changePct, regularMarketVolume: volume } = quote

    // ─── 1. 당일 등락률 분석 ──────────────────────────────
    if (changePct >= 5) {
      signals.push({
        type: 'positive',
        category: 'trend',
        message: `오늘 ${changePct.toFixed(1)}% 급등했어요! 🚀 뭔가 좋은 소식이 있었나 봐요.`,
        detail: '5% 이상 상승은 "급등"으로 분류돼요. 이런 날은 뉴스를 꼭 확인해봐요!',
      })
    }
    else if (changePct >= 2) {
      signals.push({
        type: 'positive',
        category: 'trend',
        message: `오늘 ${changePct.toFixed(1)}% 올랐어요 📈 긍정적인 흐름이에요.`,
      })
    }
    else if (changePct <= -5) {
      signals.push({
        type: 'negative',
        category: 'trend',
        message: `오늘 ${Math.abs(changePct).toFixed(1)}% 급락했어요 😨 뉴스를 확인해봐야 할 것 같아요.`,
        detail: '5% 이상 하락은 "급락"이에요. 공매도, 실적 쇼크, 악재 뉴스가 있을 수 있어요.',
      })
    }
    else if (changePct <= -2) {
      signals.push({
        type: 'negative',
        category: 'trend',
        message: `오늘 ${Math.abs(changePct).toFixed(1)}% 내렸어요 📉 조정 구간일 수 있어요.`,
      })
    }
    else {
      signals.push({
        type: 'neutral',
        category: 'trend',
        message: `오늘은 거의 보합세예요 (${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}%) — 관망하는 투자자가 많은 것 같아요.`,
      })
    }

    // ─── 2. 이동평균선 분석 ──────────────────────────────
    if (indicators.priceAboveMA5 && indicators.priceAboveMA20) {
      signals.push({
        type: 'positive',
        category: 'trend',
        message: `5일, 20일 이동평균선 모두 위에 있어요 ✅ 단기·중기 흐름이 모두 좋은 상태예요!`,
        termKey: '이동평균선',
        detail: '현재가가 5일선과 20일선 모두 위에 있으면 "상승 추세"로 봐요.',
      })
    }
    else if (indicators.priceAboveMA5 && !indicators.priceAboveMA20) {
      signals.push({
        type: 'neutral',
        category: 'trend',
        message: `5일 이동평균선 위에는 있지만, 20일선은 아직 못 넘었어요. 단기 반등 중이에요.`,
        termKey: '이동평균선',
      })
    }
    else if (!indicators.priceAboveMA5 && !indicators.priceAboveMA20) {
      signals.push({
        type: 'negative',
        category: 'trend',
        message: `5일, 20일 이동평균선 모두 아래에 있어요 ⚠️ 지금은 하락 흐름이에요.`,
        termKey: '이동평균선',
      })
    }

    // ─── 3. 골든크로스 / 데드크로스 ────────────────────────
    if (indicators.goldenCross) {
      signals.push({
        type: 'positive',
        category: 'trend',
        message: `골든크로스가 최근에 발생했어요! 🌟 5일선이 20일선을 위로 뚫은 강한 상승 신호예요!`,
        termKey: '골든크로스',
        detail: '골든크로스는 단기 상승 에너지가 중기 흐름을 이겼다는 신호예요.',
      })
    }
    else if (indicators.deadCross) {
      signals.push({
        type: 'negative',
        category: 'trend',
        message: `최근에 데드크로스가 발생했어요 ⚠️ 5일선이 20일선 아래로 내려간 약세 신호예요.`,
        termKey: '데드크로스',
      })
    }

    // ─── 4. 거래량 분석 ──────────────────────────────────
    const volRatio = volume / indicators.volumeAvg20

    if (volRatio >= 3) {
      signals.push({
        type: 'warning',
        category: 'volume',
        message: `거래량이 평소보다 ${volRatio.toFixed(0)}배나 많아요! 🔥 큰 이슈가 있거나 기관/외국인이 크게 움직인 것 같아요.`,
        termKey: '거래량',
        detail: '거래량이 폭발적으로 늘면 주가가 크게 움직일 준비가 된 것일 수 있어요.',
      })
    }
    else if (volRatio >= 2) {
      signals.push({
        type: 'neutral',
        category: 'volume',
        message: `거래량이 평소보다 약 ${volRatio.toFixed(1)}배 많네요. 관심이 높아지고 있는 것 같아요.`,
        termKey: '거래량',
      })
    }
    else if (volRatio < 0.5) {
      signals.push({
        type: 'neutral',
        category: 'volume',
        message: `거래량이 평소의 절반도 안 돼요. 관망하는 투자자가 많은 조용한 날이에요.`,
        termKey: '거래량',
      })
    }

    // ─── 5. RSI 분석 ─────────────────────────────────────
    const { currentValue: rsiValue, signal: rsiSignal } = indicators.rsi14

    if (!isNaN(rsiValue)) {
      if (rsiSignal === 'overbought') {
        signals.push({
          type: 'warning',
          category: 'momentum',
          message: `RSI가 ${rsiValue.toFixed(0)}로 과매수 구간이에요 ⚠️ 단기적으로 조정을 받을 수 있어요.`,
          termKey: 'RSI',
          detail: 'RSI 70 이상 = 너무 많이 올랐을 수 있다는 신호. 절대적인 건 아니에요!',
        })
      }
      else if (rsiSignal === 'oversold') {
        signals.push({
          type: 'positive',
          category: 'momentum',
          message: `RSI가 ${rsiValue.toFixed(0)}로 과매도 구간이에요 💡 반등 가능성이 있어요.`,
          termKey: 'RSI',
          detail: 'RSI 30 이하 = 너무 많이 떨어졌을 수 있다는 신호. 반등 기회일 수도 있어요.',
        })
      }
    }

    // ─── 6. PER 밸류에이션 분석 ───────────────────────────
    if (quote.trailingPE !== undefined && quote.trailingPE !== null) {
      const per = quote.trailingPE
      if (per > 0 && per < 10) {
        signals.push({
          type: 'positive',
          category: 'valuation',
          message: `PER이 ${per.toFixed(1)}로 비교적 저렴한 편이에요. 같은 업종 다른 회사와 비교해봐요!`,
          termKey: 'PER',
        })
      }
      else if (per > 50) {
        signals.push({
          type: 'warning',
          category: 'valuation',
          message: `PER이 ${per.toFixed(1)}로 높아요. 미래 성장에 대한 기대가 많이 반영된 것 같아요.`,
          termKey: 'PER',
          detail: 'PER이 높다고 나쁜 건 아니에요. 성장주는 높은 PER이 일반적이에요.',
        })
      }
    }

    return signals
  }

  /**
   * 모든 신호를 바탕으로 한 줄 요약을 만들어요
   */
  function generateSummary(quote: StockQuote, signals: AnalysisSignal[]): string {
    const positiveCount = signals.filter(s => s.type === 'positive').length
    const negativeCount = signals.filter(s => s.type === 'negative').length
    const { regularMarketChangePercent: changePct, shortName } = quote

    if (positiveCount > negativeCount + 1) {
      return `${shortName}은(는) 지금 여러 긍정적인 신호가 나타나고 있어요! 📈 하지만 투자는 항상 신중하게!`
    }
    else if (negativeCount > positiveCount + 1) {
      return `${shortName}은(는) 지금 조심이 필요한 구간이에요. 📉 흐름이 약한 상태예요.`
    }
    else {
      return `${shortName}은(는) 혼조세를 보이고 있어요. 좀 더 지켜보는 게 좋을 것 같아요.`
    }
  }

  /**
   * 최종 분석 결과 생성
   */
  function analyzeStock(
    quote: StockQuote,
    indicators: TechnicalIndicators,
  ): StockAnalysis {
    const signals = generateSignals(quote, indicators)
    const summary = generateSummary(quote, signals)

    return {
      ticker: quote.symbol,
      signals,
      summary,
      generatedAt: new Date(),
    }
  }

  return {
    analyzeStock,
    generateSignals,
    generateSummary,
  }
}
