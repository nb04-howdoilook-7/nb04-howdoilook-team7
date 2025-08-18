function calculateScore(rankBy, style) {
  // 랭킹 산정 기준에 따라 랭킹 점수 계산
  const { Curation, curationCount } = style;
  if (Curation.length === 0) {
    return 0; // 이거보다 curationCount 쓰는게 직관적인거 같음
  }
  // if (curationCount === 0) {
  //   return 0; // 큐레이션이 0인 게시글은 0점으로 처리 (안하면 NaN나옴)
  //   // 지금은 게시글에 curation 달아도 curationCount가 증가하지 않음
  //   // 추후에 기능 추가 하고 활성화 github 이슈 #25
  // }
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
    rating: calculateScore(rankBy, style), // 프론트에서 자릿수 변환함
  }));

  const sortedStyle = stylesWithScore.sort((a, b) => b.rating - a.rating);

  return sortedStyle.map(({ Curation, ...style }, idx) => ({
    ...style,
    ranking: idx + 1,
  }));
}
