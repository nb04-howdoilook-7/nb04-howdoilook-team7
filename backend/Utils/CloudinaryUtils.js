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
