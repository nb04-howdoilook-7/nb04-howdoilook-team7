import classNames from 'classnames/bind'
import styles from './StyleDetailLayout.module.scss'
import { StyleDetail } from '@services/types'
import Divider from '@libs/shared/layout/Divider'
import Icon from '@libs/shared/icon/Icon'
import { STYLE_CATEGORY_TITLE_MAP } from '@libs/shared/util-constants/constants'
import Image from 'next/image'

const cx = classNames.bind(styles)

type StyleDetailLayoutProps = {
  styleDetailContent: Omit<StyleDetail, 'imageUrls'>
  styleImageCarousel: React.ReactNode
  optionButtons: React.ReactNode
}

const StyleDetailLayout = ({ styleDetailContent, styleImageCarousel, optionButtons }: StyleDetailLayoutProps) => {
  const { tags, title, content, user, viewCount: viewsCount, curationCount: curationsCount, categories } = styleDetailContent
  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <h1 className={cx('title')}>{title}</h1>
        <div className={cx('authorInfo')}>
          {user?.profileImage && (
            <Image
              src={user.profileImage}
              width={32}
              height={32}
              alt="user-profile"
              className={cx('profileImage')}
            />
          )}
          <h2 className={cx('nickname')}>{user?.nickname ?? '알 수 없는 사용자'}</h2>
        </div>
        <div className={cx('tagsCountContainer')}>
          <div className={cx('tagsContainer')}>
            {tags.map((tag) => (
              <span key={tag}>{`#${tag}`}</span>
            ))}
          </div>
          <div className={cx('countContainer')}>
            <div className={cx('count')}>
              <Icon name='eye' height={16} width={16} alt='조회수 아이콘' />
              <span>{viewsCount}</span>
            </div>
            <div className={cx('count')}>
              <Icon name='chat' height={16} width={16} alt='큐레이팅수 아이콘' />
              <span>{curationsCount}</span>
            </div>
          </div>
        </div>
        <Divider marginBlock='0px' color='black' />
        <div className={cx('buttonsWrapper')}>{optionButtons}</div>
      </div>
      {styleImageCarousel}
      <div className={cx('body')}>
        {Object.entries(categories).map(([key, category]) => (
          <div key={key} className={cx('category')}>
            <div className={cx('categoryNameContainer')}>
              <Icon name='arrow' width={8} height={8} alt='카테고리 제목 글머리' />
              <h3>{STYLE_CATEGORY_TITLE_MAP[key]}</h3>
            </div>
            <p className={cx('categoryInfo')}>{`${category.name}, ${category.brand}, ${category.price.toLocaleString()}원`}</p>
          </div>
        ))}
        <div className={cx('category')}>
          <div className={cx('categoryNameContainer')}>
            <Icon name='arrow' width={8} height={8} alt='카테고리 제목 글머리' />
            <h3>스타일 설명</h3>
          </div>
          <p className={cx('categoryInfo')}>{content}</p>
        </div>
      </div>
    </div>
  )
}

export default StyleDetailLayout
