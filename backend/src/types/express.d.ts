import type { JwtPayload } from 'jsonwebtoken';
import type { File } from 'multer';
import type { RankBy, SearchBy, SortBy } from './shared.types.ts';

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
      parsedQuery?: {
        keyword?: string | undefined;
        page: number;
        pageSize: number;
        sortBy?: SortBy;
        searchBy?: SearchBy;
        tag?: string | undefined;
        rankBy?: RankBy;
      };
      parsedCursorQuery?: {
        cursorId?: number;
        page: number;
        pageSize: number;
      };
      content?: string;
      file?: File;
    }
  }
}
