'use client';

import classNames from 'classnames/bind';
import styles from './GlobalNavigationBar.module.scss';
import Link from 'next/link';
import Icon from '@libs/shared/icon/Icon';
import { useAuth } from '@context/AuthContext';

const cx = classNames.bind(styles);

type GlobalNavigationBarProps = {};

const GlobalNavigationBar = ({}: GlobalNavigationBarProps) => {
  // AuthContext에서 실제 로그인 상태, 로그아웃 함수, 로딩 상태를 가져옵니다.
  const { isLoggedIn, logout, isLoading } = useAuth();

  return (
    <nav className={cx('container')}>
      <Link href='/' className={cx('logo')}>
        <Icon name='logo' width={200} height={22} alt='로고' priority={true} />
      </Link>
      <div className={cx('buttonContainer')}>
        <Link href='/'>갤러리</Link>
        <Link href='/ranking'>랭킹</Link>
        <Link href='/mypage'>마이페이지</Link>

        {/* 초기 로딩 중에는 버튼을 보여주지 않아 깜빡임을 방지합니다. */}
        {!isLoading && (
          <>
            {isLoggedIn ? (
              <button onClick={logout} className={cx('logoutButton')}>
                로그아웃
              </button>
            ) : (
              <Link href='/login'>로그인/회원가입</Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default GlobalNavigationBar;
