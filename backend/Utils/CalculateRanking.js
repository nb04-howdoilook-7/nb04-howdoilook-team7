function calculateScore(rankBy, style) {
  // 랭킹 산정 기준에 따라 랭킹 점수 계산
  const { Curation } = style;
  let totalScore = 0;
  if (rankBy === 'total') {
    Curation.forEach((curation) => {
      totalScore +=
        curation.trendy +
        curation.personality +
        curation.practicality +
        curation.costEffectiveness;
    });
    return totalScore / (Curation.length * 4);
  } else {
    Curation.forEach((curation) => {
      totalScore += curation[rankBy];
    });
    return totalScore / Curation.length;
  }
}

export default function getRanking(rankBy, styles) {
  // 랭킹 점수와 순위가 포함된 객체 생성
  // 랭킹 순위에 따라 정렬 후 정렬된 객체 반환
  const stylesWithScore = styles.map((style) => ({
    ...style,
    rating: calculateScore(rankBy, style).toFixed(1),
  }));

  const sortedStyle = stylesWithScore.sort((a, b) => b.rating - a.rating);

  return sortedStyle.map(({ Curation, ...style }, idx) => ({
    ...style,
    ranking: idx + 1,
  }));
}
