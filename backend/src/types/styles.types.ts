import type { Prisma } from '@prisma/client';
import type { Page, RankBy, SearchBy, SortBy } from './shared.types.js';
import type { UserId } from './users.types.js';

export interface StyleId {
  styleId: number;
}

export interface GetRanking extends Page {
  rankBy: RankBy;
}

export interface GetStyle extends StyleId, UserId {}

export interface GetStyleList extends Page {
  sortBy: SortBy;
  searchBy: SearchBy;
  keyword: string;
  tag?: string | undefined;
}

export interface PostStyle extends UserId {
  data: {
    title: string;
    content: string;
    Image: {
      url: string;
      publicId: string;
    }[];
    tags: string[];
  };
}

export interface PutStyle extends StyleId {
  data: {
    title?: string;
    content?: string;
    Image: {
      url: string;
      publicId: string;
    }[];
    tags: string[];
  };
}

export interface Like extends StyleId, UserId {}

export interface TransformedStyles {
  tags: string[];
  title: string;
  id: number;
  createdAt: Date;
  thumbnail: string;
  categories: Prisma.JsonValue;
  viewCount: number;
  curationCount: number;
  likeCount: number;
  Curation: {
    trendy: number;
    personality: number;
    practicality: number;
    costEffectiveness: number;
  }[];
  user: {
    id: number;
    nickname: string;
  };
}

export interface Ranks {
  styles: TransformedStyles[];
  rankBy: RankBy;
}
export interface Rank {
  style: TransformedStyles;
  rankBy: RankBy;
}
