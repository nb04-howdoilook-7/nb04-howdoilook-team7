// 공통
export type PaginationResponse<T> = {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: T[];
}

export type CategoryValue = {
  [CategoryValueField.name]: string;
  [CategoryValueField.brand]: string;
  [CategoryValueField.price]: number;
}

// Enum
export enum SortBy {
  latest = 'latest',
  mostViewed = 'mostViewed',
  mostCurated = 'mostCurated',
  mostLiked = 'mostLiked',
}

export enum SearchByStyle {
  nickname = 'nickname',
  title = 'title',
  content = 'content',
  tag = 'tag',
}

export enum SearchByCurating {
  nickname = 'nickname',
  content = 'content',
}

export enum RankBy {
  total = 'total',
  trendy = 'trendy',
  personality = 'personality',
  practicality = 'practicality',
  costEffectiveness = 'costEffectiveness',
}

export enum CategoryKey {
  top = 'top',
  bottom = 'bottom',
  outer = 'outer',
  dress = 'dress',
  shoes = 'shoes',
  bag = 'bag',
  accessory = 'accessory',
}

export enum CategoryValueField {
  name = 'name',
  brand = 'brand',
  price = 'price',
}

// SearchParams
export type GalleryStylesSearchParams = {
  sortBy: SortBy;
  searchBy: SearchByStyle;
  keyword: string;
  tag: string;
  page?: number;
}

export type RankingStylesSearchParams = {
  rankBy: RankBy;
  page: number;
}

export type CuratingsSearchParams = {
  page: number;
  searchBy: SearchByCurating;
  keyword: string;
}

// style - data
export type GalleryStyle = {
  id: number;
  thumbnail: string;
  tags: string[];
  title: string;
  content: string;
  user: { id: number; nickname: string, profileImage: string | null };
  nickname: string;
  viewCount: number;
  curationCount: number;
  likeCount: number;
  isLiked: boolean; // Keep this
  categories: {
    [key in CategoryKey]?: CategoryValue;
  };
}

export type Ranking = {
  ranking: number;
  rating: number;
}

export type RankingStyle = Omit<GalleryStyle, 'content'> & Ranking

export type StyleDetail = {
  imageUrls: string[];
  isLiked: boolean; // Keep this
} & Omit<GalleryStyle, 'thumbnail'>

// style - input
export type StyleFormInput = {
  imageUrls: string[];
  tags: string[];
  title: string;
  nickname: string;
  content: string;
  categories: {
    [key in CategoryKey]?: CategoryValue;
  };
  password: string;
}

export type StyleDeleteFormInput = Pick<StyleFormInput, 'password'>

// curation - data
export type CuratingType = {
  id: number;
  user: { nickname: string, profileImage: string | null };
  userId: number;
  content: string;
  trendy: number;
  personality: number;
  practicality: number;
  costEffectiveness: number;
  comments: CommentType | null;
}

export type CommentType = {
  id: number;
  userId: number;
  content: string;
  user: {
    nickname: string;
    profileImage: string | null;
  };
}

// curation - input
export type CuratingFormInput = {
  content: string;
  trendy: number;
  personality: number;
  practicality: number;
  costEffectiveness: number;
}

export type CuratingDeleteFormInput = {}

export type CommentFormInput = {
  content: string;
}

// baseUrl - input
export type BaseUrlSettingFormInput = {
  baseUrl: string;
}
// --- Added for Auth and MyPage ---

export type SignupFormInput = {
  email: string;
  nickname: string;
  password: string;
}

export type LoginFormInput = {
  email: string;
  password: string;
}

export type AuthResponse = {
  accessToken: string;
}

export type UserProfile = {
  id: number;
  email: string;
  nickname: string | null;
  profileImage: string | null;
  _count: {
    Curation: number;
    Style: number;
    likes: number;
  };
}

export type ProfileUpdateInput = {
  nickname?: string;
  password?: string;
  currentPassword?: string;
  profileImage?: string;
}
