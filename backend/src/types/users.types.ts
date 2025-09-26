import type { Page } from './shared.types.js';

export interface UserId {
  userId: number;
}

export interface PutUser extends UserId {
  data: {
    nickname: string;
    password: string;
    currentPassword: string;
    profileImage: string;
  };
}

export interface UpdateData {
  nickname?: string;
  password?: string;
  currentPassword?: string;
  profileImage?: string;
  imageId?: number;
}

export interface GetUserStyle extends UserId, Page {}

export interface StyleUpdateCounts {
  likeCount: number;
  curationCount: number;
}
