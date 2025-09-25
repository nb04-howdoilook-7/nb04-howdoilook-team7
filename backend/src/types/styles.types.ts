import type { Image } from '@prisma/client';
import type { Page, RankBy, SearchBy, SortBy } from './shared.types.js';
import type { UserId } from './users.types.js';

export interface GetRanking extends Page {
  rankBy: RankBy;
}

export interface GetStyleList extends Page {
  sortBy: SortBy;
  searchBy: SearchBy;
  keyword: string;
  tag?: string | null;
}

export interface PostStyle extends UserId {
  title: string;
  thumbnail?: string;
  content: string;
  imageUrls: string;
  Image: Image;
  tags: string[];
}
