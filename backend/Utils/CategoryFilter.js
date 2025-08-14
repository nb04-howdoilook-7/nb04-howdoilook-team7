// 카테고리에 값이 없으면 제외시켜주는 util함수
export default function categoryFilter(keyword) {
  return Object.fromEntries(
    Object.entries(keyword).filter(([key, val]) => {
      return val !== null && Object.keys(val).length > 0;
    }),
  );
}
