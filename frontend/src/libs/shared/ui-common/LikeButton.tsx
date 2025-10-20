'use client'

import { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './LikeButton.module.scss'
import Icon from '@libs/shared/icon/Icon'
import { toggleStyleLike } from '@services/api'

const cx = classNames.bind(styles)

interface LikeButtonProps {
  styleId: number;
  initialIsLiked: boolean;
  onLikeToggle?: (newIsLiked: boolean) => void;
}

const LikeButton = ({ styleId, initialIsLiked, onLikeToggle }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)

  const handleClick = async () => {
    try {
      await toggleStyleLike(styleId)
      setIsLiked((prev) => {
        const newIsLiked = !prev
        if (onLikeToggle) {
          onLikeToggle(newIsLiked)
        }
        return newIsLiked
      })
    } catch (error) {
      console.error('좋아요 토글 실패:', error)
    }
  }

  return (
    <button onClick={handleClick} className={cx('likeButton')}>
      <Icon name={isLiked ? 'heart2' : 'heart1'} width={24} height={24} alt="좋아요" />
    </button>
  )
}

export default LikeButton