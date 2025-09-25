export interface UserId {
  userId: number;
}

export interface UpdateUser extends UserId {
  nickname?: string;
  password?: string;
  currentPassword?: string;
  profileImage?: string;
}

export interface GetUserStyle extends UserId {
  page: number;
  limit: string;
}

export interface StyleUpdateCounts {
  likeCount: number;
  curationCount: number;
}
