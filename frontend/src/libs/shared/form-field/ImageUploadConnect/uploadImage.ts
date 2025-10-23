import { getUploadSignature } from '@services/api';

const SIZE_LIMIT_MB = 5;
const BYTES_IN_MEGABYTES = 1024 * 1024;

const uploadImage = async (file: File) => {
  if (file.size > SIZE_LIMIT_MB * BYTES_IN_MEGABYTES) {
    alert(`파일 사이즈가 너무 큽니다. 5MB 이하의 파일을 업로드해주세요.\n파일명: ${file.name}`);
    return;
  }

  try {
    const { timestamp, signature, apiKey, cloudName, folder } = await getUploadSignature();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return { url: data.secure_url, publicId: data.public_id };
  } catch (error) {
    console.error('Upload failed', error);
    alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
  }
};

export default uploadImage;