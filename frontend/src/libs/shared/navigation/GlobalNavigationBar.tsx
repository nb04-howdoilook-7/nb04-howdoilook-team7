"use client";

import classNames from "classnames/bind";
import styles from "./GlobalNavigationBar.module.scss";
import Link from "next/link";
import Icon from "@libs/shared/icon/Icon";
import { useState } from "react";

const cx = classNames.bind(styles);

type GlobalNavigationBarProps = {};

const GlobalNavigationBar = ({}: GlobalNavigationBarProps) => {
  // NOTE: 실제 로그인 기능 구현 시, 전역 상태나 세션에서 로그인 여부를 받아와야 함
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // NOTE: 실제 로그아웃 로직이 필요
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  return (
    <nav className={cx("container")}>
      <Link href="/" className={cx("logo")}>
        <Icon name="logo" width={200} height={22} alt="로고" priority={true} />
      </Link>
      <div className={cx("buttonContainer")}>
        <Link href="/">갤러리</Link>
        <Link href="/ranking">랭킹</Link>
        <Link href="/mypage">마이페이지</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className={cx("logoutButton")}>
            로그아웃
          </button>
        ) : (
          <Link href="/login">로그인/회원가입</Link>
        )}
      </div>
    </nav>
  );
};

export default GlobalNavigationBar;
