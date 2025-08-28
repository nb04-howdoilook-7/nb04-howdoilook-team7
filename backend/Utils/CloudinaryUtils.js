// Cloudinary URL에서 public_id를 추출
export function extractPublicIdFromCloudinaryUrl(url) {
  const parts = url.split('/upload/');
  if (parts.length > 1) {
    const pathWithVersion = parts[1];
    const publicIdWithExtension = pathWithVersion.split('/').slice(1).join('/');
    return publicIdWithExtension.substring( 0, publicIdWithExtension.lastIndexOf('.')); // prettier-ignore
  }
  return null;
}

export function deletionList(cloudinary, existingImages) {
  return existingImages.map(async (image) => {
    const publicId = extractPublicIdFromCloudinaryUrl(image.url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
      } catch (e) {
        console.error(
          `Cloudinary에서 이미지 ${publicId} 삭제 실패: ${e.message}`,
        );
      }
    }
  });
}

export async function deletionSingle(cloudinary, existingImage) {
  const publicId = extractPublicIdFromCloudinaryUrl(existingImage.url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
    } catch (e) {
      console.error(
        `Cloudinary에서 이미지 ${publicId} 삭제 실패: ${e.message}`,
      );
    }
  }
}
