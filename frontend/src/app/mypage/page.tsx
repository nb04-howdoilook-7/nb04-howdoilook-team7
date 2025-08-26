"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@context/AuthContext";
import * as api from "@services/api";
import { GalleryStyle } from "@services/types";
import MyPageStyleList from '@libs/mypage/ui-mypage/MyPageStyleList';
import { useRouter } from 'next/navigation';
import Icon from '@libs/shared/icon/Icon';

export default function MyPage() {
  const { user, isLoggedIn, isLoading, login, refreshUserProfile } = useAuth(); // Corrected destructuring
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-styles");
  const [myStyles, setMyStyles] = useState<GalleryStyle[]>([]);
  const [likedStyles, setLikedStyles] = useState<GalleryStyle[]>([]);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [profileUpdateMessage, setProfileUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return;

      try {
        if (activeTab === "my-styles") {
          const response = await api.getMyStyles();
          console.log('My Styles API Response:', response);
          setMyStyles(response.data);
        } else if (activeTab === "liked-styles") {
          const response = await api.getMyLikes();
          console.log('Liked Styles API Response:', response);
          setLikedStyles(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch data for MyPage:", error);
        // Optionally set an error message for the user
      }
    };

    fetchData();
  }, [activeTab, isLoggedIn]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateMessage(null);
    try {
      await api.updateMyProfile({ nickname });
      setProfileUpdateMessage({
        type: "success",
        text: "프로필이 성공적으로 업데이트되었습니다.",
      });
      await refreshUserProfile(); // Call refreshUserProfile after successful update
      console.log('Profile update successful, refreshUserProfile called.');
    } catch (error) {
      console.error("Failed to update profile:", error);
      setProfileUpdateMessage({
        type: "error",
        text: "프로필 업데이트에 실패했습니다.",
      });
      console.log('Profile update failed.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-styles":
        return <MyPageStyleList styles={myStyles} />;
      case "liked-styles":
        return <MyPageStyleList styles={likedStyles} />;
      case "settings":
        return (
          <div className={styles.settings}>
            <h3>프로필 정보 수정</h3>
            <form
              onSubmit={handleProfileUpdate}
              className={styles.settingsForm}
            >
              <div className={styles.formGroup}>
                <label htmlFor="nickname">닉네임</label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              {/* 프로필 이미지 업로드 필드는 추후 구현 */}
              <button type="submit" className={styles.saveButton}>
                저장
              </button>
              {profileUpdateMessage && (
                <p
                  className={`${styles.message} ${
                    styles[profileUpdateMessage.type]
                  }`}
                >
                  {profileUpdateMessage.text}
                </p>
              )}
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.loginRequiredContainer}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <Icon name="arrow" width={24} height={24} alt="뒤로가기" rotate={180} />
          <span>뒤로가기</span>
        </button>
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
          {user?.profileImage && (
            <Image
              src={user.profileImage}
              alt={user.nickname || "Profile"}
              width={100}
              height={100}
            />
          )}
        </div>
        <div className={styles.profileInfo}>
          <h2>{user?.nickname || "사용자"}</h2>
          <p>{user?.email}</p>
          <div className={styles.counts}>
            <span>작성한 스타일 {user?._count?.Style || 0}</span>
            <span>작성한 큐레이션 {user?._count?.Curation || 0}</span>
          </div>
        </div>
        <div className={styles.profileActions}>
          <Link href="/mypage/edit" className={styles.editButton}>
            프로필 수정
          </Link>
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
        </nav>
        <div className={styles.tabContent}>{renderTabContent()}</div>
      </main>
    </div>
  );
}
