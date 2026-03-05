// data/glossary.ts
// 주린이를 위한 주식 용어 사전
// 모든 설명은 친근하고 쉬운 한국어로 작성

import type { GlossaryTerm } from '~/types/stock'

export const glossaryData: Record<string, GlossaryTerm> = {
  PER: {
    term: 'PER',
    koreanName: '주가수익비율',
    shortExplanation: '주가가 이익의 몇 배인지 나타내는 수치예요',
    fullExplanation:
      'PER은 "이 회사 주가가 1년 순이익의 몇 배냐?"를 나타내요. ' +
      '예를 들어 PER이 10이면, 지금 주가가 연간 순이익의 10배라는 뜻이에요. ' +
      'PER이 낮을수록 "싸다"고 볼 수 있지만, 업종마다 평균이 다르니 같은 업종끼리 비교하는 게 중요해요. ' +
      '성장주(IT, 바이오)는 PER이 높아도 미래 성장을 기대하고 투자하는 경우가 많아요.',
    example: 'PER 10 = 지금 주가로 10년치 순이익을 내면 본전. PER 30은 30년치!',
    relatedTerms: ['PBR', 'EPS'],
    difficulty: 2,
  },

  PBR: {
    term: 'PBR',
    koreanName: '주가순자산비율',
    shortExplanation: '회사를 지금 팔면 장부가격의 몇 배를 주고 사는 건지 나타내요',
    fullExplanation:
      'PBR은 "이 회사의 실제 자산 가치 대비 주가가 얼마냐?"를 봐요. ' +
      'PBR 1이면 회사 청산가치와 주가가 같은 것. ' +
      'PBR이 1보다 낮으면 이론상 "자산보다 싸게 파는 것"이라 저평가 신호일 수 있어요. ' +
      '하지만 PBR이 낮다고 무조건 좋은 건 아니에요. 회사가 손실을 계속 내고 있을 수도 있거든요!',
    example: 'PBR 0.8 = 100억짜리 자산을 80억에 사는 셈!',
    relatedTerms: ['PER', 'ROE'],
    difficulty: 2,
  },

  EPS: {
    term: 'EPS',
    koreanName: '주당순이익',
    shortExplanation: '주식 1주당 회사가 얼마를 벌었는지예요',
    fullExplanation:
      'EPS는 전체 순이익을 발행 주식수로 나눈 값이에요. ' +
      'EPS가 높을수록 주당 수익이 많다는 뜻이고, ' +
      'EPS가 꾸준히 증가하면 회사가 성장하고 있다는 신호예요. ' +
      'PER을 계산할 때 EPS를 사용해요: PER = 주가 ÷ EPS',
    example: 'EPS 5,000원 = 그 주식 1주가 1년에 5,000원을 벌어줬다는 뜻',
    relatedTerms: ['PER'],
    difficulty: 2,
  },

  ROE: {
    term: 'ROE',
    koreanName: '자기자본이익률',
    shortExplanation: '주주 돈을 얼마나 효율적으로 굴려 수익을 냈는지예요',
    fullExplanation:
      'ROE는 "주주가 투자한 돈으로 얼마나 잘 벌었나"를 보여줘요. ' +
      'ROE 20%면 100만원 투자해서 20만원을 벌었다는 뜻. ' +
      '워런 버핏도 ROE 15% 이상인 기업을 선호한다고 해요. ' +
      'ROE가 꾸준히 높은 기업은 경쟁 우위가 있는 좋은 회사일 가능성이 높아요.',
    example: 'ROE 20% = 내 투자금의 20%를 매년 벌어주는 효율적인 경영!',
    relatedTerms: ['PBR', 'EPS'],
    difficulty: 3,
  },

  이동평균선: {
    term: '이동평균선',
    koreanName: '이동평균선 (Moving Average)',
    shortExplanation: '일정 기간 종가의 평균을 이어 만든 선이에요',
    fullExplanation:
      '5일 이동평균선은 최근 5일간 주가의 평균을 이어 그린 선이에요. ' +
      '주가가 이 선 위에 있으면 "단기 상승 추세", 아래면 "단기 하락 추세"라고 봐요. ' +
      '5일선은 단기 흐름, 20일선은 중기 흐름, 60일선은 장기 흐름을 나타내요. ' +
      '여러 이동평균선이 정배열(5일선이 맨 위)이면 강한 상승 추세예요!',
    example: '5일선 돌파 = 단기 긍정 신호! 20일선은 중기 추세를 봐요.',
    relatedTerms: ['골든크로스', '데드크로스', 'RSI'],
    difficulty: 2,
  },

  거래량: {
    term: '거래량',
    koreanName: '거래량 (Volume)',
    shortExplanation: '하루에 주식이 얼마나 많이 사고 팔렸는지예요',
    fullExplanation:
      '거래량은 그날 매수와 매도가 체결된 총 주식 수예요. ' +
      '주가가 오를 때 거래량도 많으면 "강한 상승"이고, ' +
      '주가가 올랐는데 거래량이 적으면 "힘없는 상승"일 수 있어요. ' +
      '거래량이 평소의 3배 이상이면 기관이나 외국인이 대거 움직이거나 큰 뉴스가 터진 신호예요!',
    example: '거래량 폭발 = 기관/외국인이 대거 매수하거나 뉴스가 터진 것!',
    relatedTerms: ['이동평균선'],
    difficulty: 1,
  },

  RSI: {
    term: 'RSI',
    koreanName: '상대강도지수 (Relative Strength Index)',
    shortExplanation: '주가가 과하게 올랐는지, 과하게 떨어졌는지 알려줘요',
    fullExplanation:
      'RSI는 0~100 사이 값으로, ' +
      '70 이상이면 "너무 올랐어요 (과매수)", ' +
      '30 이하면 "너무 떨어졌어요 (과매도)" 신호예요. ' +
      '과매수 구간에서 팔거나 과매도 구간에서 사는 전략에 쓰이지만, ' +
      '이게 절대적인 기준은 아니에요! 추세가 강하면 RSI가 오래 70 이상에 머물 수도 있거든요.',
    example: 'RSI 80 = 과매수! 조정받을 수 있어요. RSI 25 = 과매도! 반등 가능성 있어요.',
    relatedTerms: ['이동평균선'],
    difficulty: 3,
  },

  골든크로스: {
    term: '골든크로스',
    koreanName: '골든크로스 (Golden Cross)',
    shortExplanation: '단기 이동평균선이 장기선을 위로 뚫을 때! 강세 신호예요',
    fullExplanation:
      '5일 이동평균선이 20일 이동평균선을 아래에서 위로 교차하는 순간을 "골든크로스"라고 해요. ' +
      '주가가 단기적으로 강한 상승세를 보이기 시작했다는 신호로 많이 활용해요. ' +
      '반대로 5일선이 20일선을 위에서 아래로 뚫으면 "데드크로스"예요. ' +
      '단, 골든크로스가 나타났다고 무조건 오르는 건 아니에요. 다른 지표와 함께 봐야 해요!',
    example: '5일선이 20일선 위로 올라가면 골든크로스 - 많은 트레이더가 매수 신호로 봐요!',
    relatedTerms: ['데드크로스', '이동평균선'],
    difficulty: 2,
  },

  데드크로스: {
    term: '데드크로스',
    koreanName: '데드크로스 (Dead Cross)',
    shortExplanation: '단기 이동평균선이 장기선 아래로 내려갈 때! 약세 신호예요',
    fullExplanation:
      '5일 이동평균선이 20일 이동평균선을 위에서 아래로 교차하는 순간이에요. ' +
      '단기 하락 추세가 강해졌다는 신호로 봐요. ' +
      '골든크로스의 반대 개념이에요. ' +
      '데드크로스가 나타나면 많은 트레이더들이 매도 신호로 인식해요.',
    example: '5일선이 20일선 아래로 내려가면 데드크로스 - 약세 신호로 주의가 필요해요.',
    relatedTerms: ['골든크로스', '이동평균선'],
    difficulty: 2,
  },

  시가총액: {
    term: '시가총액',
    koreanName: '시가총액 (Market Capitalization)',
    shortExplanation: '회사 전체의 주식을 현재 가격으로 모두 사면 얼마인지예요',
    fullExplanation:
      '시가총액 = 현재 주가 × 발행된 총 주식 수예요. ' +
      '시총이 클수록 "큰 회사"예요. ' +
      '삼성전자처럼 시총 수백조원짜리 회사는 "대형주", ' +
      '수천억원대는 "중형주", 수백억원대는 "소형주"라고 불러요. ' +
      '대형주는 안전하지만 성장이 느리고, 소형주는 변동성이 크지만 성장 가능성도 커요.',
    example: '삼성전자 시총 약 400조원 = 그만큼 돈이 있어야 삼성 전체를 살 수 있다는 뜻!',
    relatedTerms: ['PER', 'PBR'],
    difficulty: 1,
  },

  배당수익률: {
    term: '배당수익률',
    koreanName: '배당수익률 (Dividend Yield)',
    shortExplanation: '주식을 사면 1년에 주가 대비 몇 %의 배당금을 받을 수 있는지예요',
    fullExplanation:
      '배당수익률 = (1주당 연간 배당금 ÷ 현재 주가) × 100%예요. ' +
      '예를 들어 주가 5만원에 배당금이 2,500원이면 배당수익률은 5%예요. ' +
      '배당수익률이 높은 주식은 은행 예금처럼 꾸준한 수입을 원하는 장기 투자자에게 인기 있어요. ' +
      '하지만 갑자기 배당수익률이 너무 높아지면 주가가 떨어졌기 때문일 수도 있으니 주의!',
    example: '주가 5만원, 배당금 2,500원 → 배당수익률 5% (은행 이자보다 높죠!)',
    relatedTerms: ['시가총액'],
    difficulty: 2,
  },

  캔들차트: {
    term: '캔들차트',
    koreanName: '캔들차트 (Candlestick Chart)',
    shortExplanation: '하루의 주가 움직임을 촛불 모양으로 표현한 차트예요',
    fullExplanation:
      '캔들차트는 하루의 시가(시작가), 종가(마지막가), 고가(최고가), 저가(최저가)를 한 번에 보여줘요. ' +
      '빨간 캔들(양봉) = 시가보다 종가가 높음 = 그날 올랐어요! ' +
      '파란/검은 캔들(음봉) = 시가보다 종가가 낮음 = 그날 떨어졌어요. ' +
      '캔들 위아래로 튀어나온 선을 "꼬리"라고 하는데, 꼬리가 길면 그 방향으로 강한 반발이 있었다는 뜻이에요.',
    example: '빨간 캔들 = 상승! 파란 캔들 = 하락! 캔들 높이가 클수록 그날 변동이 컸어요.',
    relatedTerms: ['거래량', '이동평균선'],
    difficulty: 1,
  },
}
