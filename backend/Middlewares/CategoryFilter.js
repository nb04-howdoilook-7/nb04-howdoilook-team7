// 카테고리에 값이 없으면 제외시켜주는 util함수
export default function categoryFilter() {
  return (req, res, next) => {
    const { categories } = req.body;
    req.body.categories = Object.fromEntries(
      Object.entries(categories).filter(([key, val]) => {
        return val !== null && Object.keys(val).length > 0;
      }),
    );
    next();
  };
}
