// composables/useIndicators.ts
// OHLCV 데이터에서 이동평균선, RSI 등 기술 지표를 계산해요

import type { CandlestickData, MovingAverage, RSIData, TechnicalIndicators } from '~/types/stock'

export function useIndicators() {
  /**
   * 단순 이동평균선(SMA) 계산
   * @param closes 종가 배열 (최신이 마지막)
   * @param period 기간 (5, 20, 60 등)
   */
  function calculateSMA(closes: number[], period: number): number[] {
    const sma: number[] = []
    for (let i = 0; i < closes.length; i++) {
      if (i < period - 1) {
        sma.push(NaN) // 기간이 부족하면 NaN
      }
      else {
        const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
        sma.push(sum / period)
      }
    }
    return sma
  }

  /**
   * RSI (상대강도지수) 계산 - Wilder 방식
   * @param closes 종가 배열
   * @param period 기간 (보통 14)
   */
  function calculateRSI(closes: number[], period: number = 14): number[] {
    if (closes.length < period + 1) return closes.map(() => NaN)

    const rsi: number[] = closes.map(() => NaN)
    let avgGain = 0
    let avgLoss = 0

    // 첫 번째 RSI 계산 (단순 평균)
    for (let i = 1; i <= period; i++) {
      const change = closes[i] - closes[i - 1]
      avgGain += Math.max(change, 0)
      avgLoss += Math.max(-change, 0)
    }
    avgGain /= period
    avgLoss /= period

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    rsi[period] = 100 - 100 / (1 + rs)

    // 이후 RSI는 Wilder 스무딩 방식
    for (let i = period + 1; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1]
      avgGain = (avgGain * (period - 1) + Math.max(change, 0)) / period
      avgLoss = (avgLoss * (period - 1) + Math.max(-change, 0)) / period

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
      rsi[i] = 100 - 100 / (1 + rs)
    }

    return rsi
  }

  /**
   * 골든크로스 감지
   * MA5가 MA20을 최근에 상향 돌파했는지 확인
   */
  function detectGoldenCross(ma5Values: number[], ma20Values: number[]): boolean {
    if (ma5Values.length < 2 || ma20Values.length < 2) return false
    const len = Math.min(ma5Values.length, ma20Values.length)
    // 최근 3일 내에 골든크로스가 있었는지 확인
    for (let i = len - 1; i >= Math.max(0, len - 3); i--) {
      const prev5 = ma5Values[i - 1]
      const prev20 = ma20Values[i - 1]
      const curr5 = ma5Values[i]
      const curr20 = ma20Values[i]
      if (!isNaN(prev5) && !isNaN(prev20) && !isNaN(curr5) && !isNaN(curr20)) {
        if (prev5 <= prev20 && curr5 > curr20) return true
      }
    }
    return false
  }

  /**
   * 데드크로스 감지
   * MA5가 MA20을 최근에 하향 돌파했는지 확인
   */
  function detectDeadCross(ma5Values: number[], ma20Values: number[]): boolean {
    if (ma5Values.length < 2 || ma20Values.length < 2) return false
    const len = Math.min(ma5Values.length, ma20Values.length)
    for (let i = len - 1; i >= Math.max(0, len - 3); i--) {
      const prev5 = ma5Values[i - 1]
      const prev20 = ma20Values[i - 1]
      const curr5 = ma5Values[i]
      const curr20 = ma20Values[i]
      if (!isNaN(prev5) && !isNaN(prev20) && !isNaN(curr5) && !isNaN(curr20)) {
        if (prev5 >= prev20 && curr5 < curr20) return true
      }
    }
    return false
  }

  /**
   * 전체 기술 지표 계산
   * OHLCV 데이터를 받아서 모든 지표를 한 번에 계산해요
   */
  function calculateIndicators(history: CandlestickData[]): TechnicalIndicators | null {
    if (!history || history.length < 20) return null

    const closes = history.map(d => d.close)
    const volumes = history.map(d => d.volume)
    const dates = history.map(d => d.date)

    // 이동평균선 계산
    const sma5 = calculateSMA(closes, 5)
    const sma20 = calculateSMA(closes, 20)
    const sma60 = calculateSMA(closes, 60)

    // RSI 계산
    const rsiValues = calculateRSI(closes, 14)

    // 20일 평균 거래량
    const recentVolumes = volumes.slice(-20)
    const volumeAvg20 = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length

    // 현재 값 (마지막 유효값)
    const currentPrice = closes[closes.length - 1]
    const currentMA5 = sma5[sma5.length - 1]
    const currentMA20 = sma20[sma20.length - 1]
    const currentMA60 = sma60.findLast(v => !isNaN(v)) ?? NaN
    const currentRSI = rsiValues.findLast(v => !isNaN(v)) ?? 50

    // RSI 신호 판단
    const rsiSignal: RSIData['signal'] =
      currentRSI >= 70 ? 'overbought' : currentRSI <= 30 ? 'oversold' : 'neutral'

    const buildMA = (period: number, values: number[], label: string): MovingAverage => ({
      period,
      values: values
        .map((value, i) => ({ date: dates[i], value }))
        .filter(v => !isNaN(v.value)),
      currentValue: values.findLast(v => !isNaN(v)) ?? NaN,
      label,
    })

    return {
      ma5: buildMA(5, sma5, '5일 이동평균선'),
      ma20: buildMA(20, sma20, '20일 이동평균선'),
      ma60: buildMA(60, sma60, '60일 이동평균선'),
      rsi14: {
        values: rsiValues
          .map((value, i) => ({ date: dates[i], value }))
          .filter(v => !isNaN(v.value)),
        currentValue: currentRSI,
        signal: rsiSignal,
      },
      volumeAvg20,
      priceAboveMA5: !isNaN(currentMA5) && currentPrice > currentMA5,
      priceAboveMA20: !isNaN(currentMA20) && currentPrice > currentMA20,
      goldenCross: detectGoldenCross(sma5, sma20),
      deadCross: detectDeadCross(sma5, sma20),
    }
  }

  return {
    calculateIndicators,
    calculateSMA,
    calculateRSI,
  }
}
