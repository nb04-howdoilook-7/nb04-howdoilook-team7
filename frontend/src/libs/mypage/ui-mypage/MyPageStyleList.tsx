import classNames from 'classnames/bind'
import styles from './MyPageStyleList.module.scss'
import { GalleryStyle } from '@services/types'
import EmptyData from '@libs/shared/empty-data/EmptyData'
import MyPageStyleCard from './MyPageStyleCard'

const cx = classNames.bind(styles)

type MyPageStyleListProps = {
  styles: GalleryStyle[]
}

const MyPageStyleList = ({ styles }: MyPageStyleListProps) => {
  if (styles.length === 0) {
    return (
      <div className={cx('emptyStyleWrapper')}>
        <EmptyData text='아직 스타일이 없어요' />
      </div>
    )
  }

  return (
    <div className={cx('container')}>
      {styles.map((style) => (
        <MyPageStyleCard card={style} key={style.id} />
      ))}
    </div>
  )
}

export default MyPageStyleList
