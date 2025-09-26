import type { JwtPayload } from 'jsonwebtoken';
import type { File } from 'multer';
import type { Page, RankBy, SearchBy, SortBy } from './shared.types.ts';

declare global {
  namespace Express {
    export interface Request {
      // middleware를 통과한 후에만 존재하므로 optional로 선언
      parentId?: number; // idSchema가 string을 반환한다고 가정
      parentType?: 'products' | 'articles';
      tokenPayload?: JwtPayload;
      parsedId?: {
        id: number;
      };
      parsedQuery?: Page & {
        keyword: string | undefined;
        sortBy: SortBy;
        searchBy: SearchBy;
        tag?: string | undefined;
      };
      parsedRankQuery?: Page & {
        rankBy: RankBy;
      };
      parsedUserQuery?: Page;
      parsedCursorQuery?: Page & {
        cursorId?: number;
      };
      parsedCurationQuery?: Page & {
        searchBy: SearchBy;
        keyword: string;
      };
      likeParams: {
        styleId: number;
      };
      content?: string;
      file?: File;
    }
  }
}
