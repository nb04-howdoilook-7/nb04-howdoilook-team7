export default function imageToImageUrls(style) {
  // db에서 조회한 객체 형태의 Image를 imageUrls 배열로 변환
  style.imageUrls = style.Image.map((image) => image.url);
  delete style.Image;
  return style;
}
