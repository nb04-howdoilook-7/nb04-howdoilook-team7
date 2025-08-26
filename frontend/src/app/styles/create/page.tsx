"use client";

import { useAuth } from "@context/AuthContext";
import LoginRequiredView from "@libs/shared/auth/LoginRequiredView";
import MainLayout from "@libs/shared/layout/MainLayout";
import StyleCreateForm from "@libs/style/feature-style/StyleCreateForm";

const StyleCreatePage = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <MainLayout title="스타일 등록">
        <p>로딩 중...</p>
      </MainLayout>
    );
  }

  if (!isLoggedIn) {
    return <LoginRequiredView />;
  }

  return (
    <MainLayout title="스타일 등록" paddingInline="618.5px">
      <StyleCreateForm />
    </MainLayout>
  );
};

export default StyleCreatePage;
