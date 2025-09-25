export type SortBy = 'latest' | 'mostViewed' | 'mostCurated' | 'mostLiked';
export type SearchBy = 'nickname' | 'title' | 'content' | 'tag';
export type RankBy = 'total' | 'trendy' | 'personality' | 'practicality' | 'costEffectiveness';
export interface Page {
  page: number;
  pageSize: number;
}
