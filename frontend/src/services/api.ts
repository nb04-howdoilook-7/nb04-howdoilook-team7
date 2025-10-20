import {
  CuratingType,
  CommentFormInput,
  CuratingFormInput,
  CuratingsSearchParams,
  StyleDetail,
  StyleFormInput,
  PaginationResponse,
  GalleryStylesSearchParams,
  GalleryStyle,
  RankingStylesSearchParams,
  RankingStyle,
  CuratingDeleteFormInput,
  StyleDeleteFormInput,
  SignupFormInput,
  LoginFormInput,
  AuthResponse,
  UserProfile,
  ProfileUpdateInput,
} from "./types";
import fetch from "./fetch";
import {
  CURATINGS_PAGE_SIZE,
  GALLERY_STYLES_PAGE_SIZE,
  RANKING_STYLES_PAGE_SIZE,
} from "@libs/shared/pagination/constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const postComment = async (
  curationId: number,
  body: CommentFormInput
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const { comment } = await response.json();
  return { comment };
};

export const putComment = async (commentId: number, body: CommentFormInput) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const deleteComment = async (commentId: number) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};

export const postCurating = async (
  styleId: number,
  body: CuratingFormInput
) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}/curations`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const getCuratings = async (
  styleId: number,
  params: CuratingsSearchParams
): Promise<PaginationResponse<CuratingType>> => {
  const urlParams = new URLSearchParams();
  urlParams.set("searchBy", params.searchBy);
  urlParams.set("keyword", params.keyword);
  urlParams.set("page", params.page.toString());
  urlParams.set("pageSize", CURATINGS_PAGE_SIZE.toString());
  const query = urlParams.toString();
  const response = await fetch(
    `${BASE_URL}/styles/${styleId}/curations?${query}`,
    {
      next: { tags: ["curatings"] },
    }
  );
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json();
  return { currentPage, totalPages, totalItemCount, data };
};

export const putCurating = async (
  curationId: number,
  body: CuratingFormInput
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const deleteCurating = async (
  curationId: number,
  body: CuratingDeleteFormInput
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}`, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(`${BASE_URL}/styles/images`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  const { imageUrl } = data;
  return { imageUrl };
};

export const postStyle = async (body: StyleFormInput): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const styleDetail = await response.json();
  return styleDetail;
};

export const getStyle = async (styleId: number): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`);
  const style = await response.json();
  return style;
};

export const putStyle = async (styleId: number, body: StyleFormInput) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const deleteStyle = async (styleId: number) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`, {
    method: "DELETE",
  });
  const { message } = await response.json();
  return { message };
};

export const getGalleryStyles = async (
  params: GalleryStylesSearchParams
): Promise<PaginationResponse<GalleryStyle>> => {
  const urlParams = new URLSearchParams();
  urlParams.set("sortBy", params.sortBy);
  urlParams.set("searchBy", params.searchBy);
  urlParams.set("keyword", params.keyword);
  urlParams.set("tag", params.tag);
  urlParams.set("page", params.page?.toString() ?? "1");
  urlParams.set("pageSize", GALLERY_STYLES_PAGE_SIZE.toString());
  const query = urlParams.toString();

  const response = await fetch(`${BASE_URL}/styles?${query}`, {
    next: { tags: ["galleryStyles"] },
  });
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json();
  return { currentPage, totalPages, totalItemCount, data };
};

export const getGalleryTags = async () => {
  const response = await fetch(`${BASE_URL}/styles/tags`, {
    next: { tags: ["galleryTags"] },
  });
  const { tags } = await response.json();
  return { tags };
};

export const getRankingStyles = async (
  params: RankingStylesSearchParams
): Promise<PaginationResponse<RankingStyle>> => {
  const urlParams = new URLSearchParams();
  urlParams.set("rankBy", params.rankBy);
  urlParams.set("page", params.page.toString());
  urlParams.set("pageSize", RANKING_STYLES_PAGE_SIZE.toString());
  const query = urlParams.toString();

  const response = await fetch(`${BASE_URL}/ranking?${query}`, {
    next: { tags: ["rankingStyles"] },
  });
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json();
  return { currentPage, totalPages, totalItemCount, data };
};

// 새로 추가된 API들

export const requestVerification = async (body: SignupFormInput) => {
  const response = await fetch(`${BASE_URL}/auth/request-verification`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "인증 요청에 실패했습니다.");
  }
  return await response.json();
};

export const confirmSignup = async (body: {
  email: string;
  code: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/confirm-signup`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "인증에 실패했습니다.");
  }
  const data: AuthResponse = await response.json();
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  return data;
};

export const login = async (body: LoginFormInput): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Login failed");
  const data: AuthResponse = await response.json();
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
    // 쿠키 설정 (1시간 동안 유효)
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600; samesite=lax`;
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  // 쿠키 만료시키기
  document.cookie = "accessToken=; path=/; max-age=0;";
};

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${BASE_URL}/users/me`);
  if (!response.ok) throw new Error("Failed to fetch profile");
  return await response.json();
};

export const updateMyProfile = async (
  body: ProfileUpdateInput
): Promise<UserProfile> => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return await response.json();
};

export const getMyStyles = async (
  page = 1,
  limit = 9
): Promise<PaginationResponse<GalleryStyle>> => {
  const response = await fetch(
    `${BASE_URL}/users/me/styles?page=${page}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch my styles");
  return await response.json();
};

export const getMyLikes = async (
  page = 1,
  limit = 9
): Promise<PaginationResponse<GalleryStyle>> => {
  const response = await fetch(
    `${BASE_URL}/users/me/likes?page=${page}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch liked styles");
  return await response.json();
};

export const deleteMyAccount = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete account");
  }
};

export const toggleStyleLike = async (styleId: number) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}/like`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to toggle style like");
  }
  return await response.json();
};

export const revalidate = async (tag: string) => {
  const response = await fetch(`/api/revalidate`, {
    method: "POST",
    body: JSON.stringify({ tag }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to revalidate");
  }
  return await response.json();
};

export type {
  CuratingType,
  CommentFormInput,
  CuratingFormInput,
  CuratingsSearchParams,
  StyleDetail,
  StyleFormInput,
  PaginationResponse,
  GalleryStylesSearchParams,
  GalleryStyle,
  RankingStylesSearchParams,
  RankingStyle,
  CuratingDeleteFormInput,
  StyleDeleteFormInput,
  SignupFormInput,
  LoginFormInput,
  AuthResponse,
  UserProfile,
  ProfileUpdateInput,
};
