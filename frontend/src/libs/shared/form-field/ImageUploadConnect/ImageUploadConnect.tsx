'use client'

import Hint from '@libs/shared/input/Hint/Hint'
import { Controller, ControllerProps, FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form'
import classNames from 'classnames/bind'
import styles from './ImageUploadConnect.module.scss'
import Button from '@libs/shared/button/Button'
import { useEffect, useRef, useState } from 'react'
import uploadImage from './uploadImage'
import Icon from '@libs/shared/icon/Icon'
import Image from 'next/image'
import { ImageInput } from '@services/types'

const cx = classNames.bind(styles)

type ImageUploadConnectProps<  F extends FieldValues,  N extends FieldPath<F>> = {
  name: N
  rules?: ControllerProps<F, N>['rules']
}

const ImageUploadConnect = <  F extends FieldValues,  N extends FieldPath<F>>({  name,  rules,}: ImageUploadConnectProps<F, N>) => {
  const { setValue, control } = useFormContext()

  const { fieldState: { error }, field: { value } } = useController({ control, name })
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<ImageInput[]>(value || [])

  useEffect(() => {
    if (value) {
      setImages(value);
    }
  }, [value]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      const files = Array.from(e.target.files)

      const uploadedImages = (await Promise.all(
        files.map((file) => uploadImage(file)),
      )).filter(Boolean) as ImageInput[]

      if (uploadedImages.length > 0) {
        const newImages = [...images, ...uploadedImages];
        setValue(name as string, newImages, { shouldValidate: true })
        setImages(newImages)
      }
    }
  }

  const handleRemoveImage = (publicId: string) => {
    const newImages = images.filter((image) => image.publicId !== publicId);
    setValue(name as string, newImages, { shouldValidate: true })
    setImages(newImages)
  }

  return (
    <div className={cx('container')}>
      <div className={cx('labelContainer')}>
        <div className={cx('label')}>사진 업로드</div>
        <Controller
          name={name}
          rules={rules}
          render={() => (
            <label>
              <input
                type='file'
                onChange={handleUploadImage}
                multiple
                accept="image/*"
                hidden
                ref={inputRef}
              />
              <Button type='button' onClick={() => inputRef.current?.click()}>파일 찾기</Button>
            </label>
          )}
        />
      </div>
      {error?.message && <Hint message={error.message} />}
      <div className={cx('previewContainer')}>
        {images.map((image) => (
          <div key={image.publicId} className={cx('imageContainer')}>
            <div className={cx('imageWrapper')}>
              <Image src={image.url} alt='미리보기 이미지' width={200} height={300} className={cx('image')} />
            </div>
            <button type='button' onClick={() => { handleRemoveImage(image.publicId) }} className={cx('button')}>
              <Icon name='cancel' alt='이미지 삭제 아이콘' width={40} height={40} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUploadConnect