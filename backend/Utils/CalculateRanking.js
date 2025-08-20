function calculateScore(rankBy, style) {
  // 랭킹 산정 기준에 따라 랭킹 점수 계산
  const { Curation, curationCount } = style;
  if (curationCount === 0) {
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

// IMDb의 '가중 평점' 방식 반영
export default function getRanking(rankBy, styles) {
  // 랭킹 점수와 순위가 포함된 객체 생성
  // 랭킹 순위에 따라 정렬 후 정렬된 객체 반환

  const m = 5; // 랭킹에 포함되기 위한 최소 평가 수 (서비스 확장 시 값을 늘려가면 됨)
  const C = 7; // 시스템의 기본 점수를 7점으로 가정

  // 각 게시물의 가중 평점(WR) 계산
  const stylesWithScore = styles.map((style) => {
    const v = style.Curation.length;
    const R = calculateScore(rankBy, style);

    if (v === 0) {
      return { ...style, rating: 0 }; // 큐레이션이 없는 경우 0점 처리
    }

    const weightedRating = (v / (v + m)) * R + (m / (v + m)) * C;

    return { ...style, rating: weightedRating };
  });

  const sortedStyle = stylesWithScore.sort((a, b) => b.rating - a.rating);

  return sortedStyle.map(({ Curation, ...style }, idx) => ({
    ...style,
    ranking: idx + 1,
  }));
}
