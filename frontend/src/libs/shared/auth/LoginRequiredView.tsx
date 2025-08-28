'use client';

import Link from 'next/link';
import styles from './LoginRequiredView.module.scss';

const LoginRequiredView = () => {
  return (
    <div className={styles.loginRequiredContainer}>
      <h2>로그인이 필요한 서비스입니다.</h2>
      <p>로그인하고 모든 기능을 이용해보세요.</p>
      <Link href="/login" className={styles.loginButton}>
        로그인 페이지로 이동
      </Link>
    </div>
  );
};

export default LoginRequiredView;
