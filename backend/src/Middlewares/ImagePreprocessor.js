function imageUrlsToImage() {
  return (req, res, next) => {
    const { imageUrls = [] } = req.body;
    // 배열 형태의 image url들을 스키마에 맞는 객체 형태로 변환
    const Image = imageUrls.map(url => ({url})); // prettier-ignore
    req.body.Image = Image;
    next();
  };
}

function addThumbnail() {
  return (req, res, next) => {
    // 추후에 유효성 검증 추가
    req.body.thumbnail = req.body.imageUrls[0];
    next();
  };
}

export { imageUrlsToImage, addThumbnail };
