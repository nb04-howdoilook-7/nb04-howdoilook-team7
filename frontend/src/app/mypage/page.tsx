"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";

// Mock data - replace with actual data from API
const myStyles = [
  "/images/gallery-example-1.png",
  "/images/gallery-example-2.png",
  "/images/gallery-example-3.png",
  "/images/gallery-example-4.png",
];

const likedStyles = [
  "/images/gallery-example-4.png",
  "/images/gallery-example-1.png",
];

export default function MyPage() {
  // NOTE: 실제 로그인 기능 구현 시, 전역 상태나 세션에서 로그인 여부를 받아와야 합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("my-styles");

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-styles":
        return (
          <div className={styles.grid}>
            {myStyles.map((src, index) => (
              <div key={index} className={styles.gridItem}>
                <Image
                  src={src}
                  alt={`My Style ${index + 1}`}
                  width={300}
                  height={300}
                />
              </div>
            ))}
          </div>
        );
      case "liked-styles":
        return (
          <div className={styles.grid}>
            {likedStyles.map((src, index) => (
              <div key={index} className={styles.gridItem}>
                <Image
                  src={src}
                  alt={`Liked Style ${index + 1}`}
                  width={300}
                  height={300}
                />
              </div>
            ))}
            {likedStyles.length === 0 && <p>좋아요한 스타일이 없습니다.</p>}
          </div>
        );
      case "settings":
        return (
          <div className={styles.settings}>
            <h3>프로필 정보 수정</h3>
            <p>이곳에서 프로필 정보를 수정할 수 있습니다.</p>
            {/* Add settings form here */}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginRequiredContainer}>
        <h2>로그인이 필요한 서비스입니다.</h2>
        <p>로그인하고 모든 기능을 이용해보세요.</p>
        <Link href="/login" className={styles.loginButton}>
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.profileSection}>
        <div className={styles.profileImage}>
          {/* Placeholder for profile image */}
        </div>
        <div className={styles.profileInfo}>
          <h2>Username</h2>
          <p>user.email@example.com</p>
        </div>
        <div className={styles.profileActions}>
          <button>프로필 수정</button>
        </div>
      </header>

      <main>
        <nav className={styles.tabs}>
          <button
            className={activeTab === "my-styles" ? styles.active : ""}
            onClick={() => setActiveTab("my-styles")}
          >
            내 스타일
          </button>
          <button
            className={activeTab === "liked-styles" ? styles.active : ""}
            onClick={() => setActiveTab("liked-styles")}
          >
            좋아요
          </button>
          <button
            className={activeTab === "settings" ? styles.active : ""}
            onClick={() => setActiveTab("settings")}
          >
            설정
          </button>
        </nav>
        <div className={styles.tabContent}>{renderTabContent()}</div>
      </main>
    </div>
  );
}
