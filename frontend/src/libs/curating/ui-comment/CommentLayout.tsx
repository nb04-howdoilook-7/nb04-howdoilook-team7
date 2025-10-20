import classNames from 'classnames/bind'
import styles from './CommentLayout.module.scss'
import { CommentType } from '@services/types'
import Image from 'next/image'

const cx = classNames.bind(styles)

type CommentLayoutProps = {
  comment: CommentType
  optionButtons: React.ReactNode
  styleAuthorId: number
}

const CommentLayout = ({
  comment,
  optionButtons,
  styleAuthorId,
}: CommentLayoutProps) => {
  const { content, user, userId } = comment
  const isStyleAuthor = userId === styleAuthorId

  return (
    <div className={cx('container')}>
      <div className={cx('authorInfo')}>
        {user?.profileImage && (
          <Image
            src={user.profileImage}
            width={24}
            height={24}
            alt="user-profile"
            className={cx('profileImage')}
          />
        )}
        <h5 className={cx('nickname')}>
          {user?.nickname ?? '탈퇴한 사용자'}
          {isStyleAuthor && <span className={cx('author')}>작성자</span>}
        </h5>
      </div>
      <p className={cx('content')}>{content}</p>
      <div className={cx('buttonsWrapper')}>{optionButtons}</div>
    </div>
  )
}

export default CommentLayout
