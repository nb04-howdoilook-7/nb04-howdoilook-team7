import type { Page, SearchBy } from './shared.types.js';
import type { StyleId } from './styles.types.js';
import type { UserId } from './users.types.js';

export interface CurationId {
  curationId: number;
}

export interface GetCurationList extends StyleId, Page {
  searchBy: SearchBy;
  keyword: string;
}

export interface CurationData {
  content: string;
  trendy: number;
  personality: number;
  practicality: number;
  costEffectiveness: number;
}

export interface PostCuration extends UserId, StyleId, CurationData {}

export interface PutCuration extends CurationId, CurationData {}

export interface DeleteCuration extends CurationId, UserId {}
