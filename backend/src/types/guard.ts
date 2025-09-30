import type { JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';
import type { RankBy, SearchBy, SortBy } from './shared.types.js';

export function hasTokenPayload(
  req: Request
): req is Request & { tokenPayload: JwtPayload & { userId: number } } {
  // 이 결과가 true가 되면 req객체에 tokenPayload가 반드시 있다는 증명
  return (
    typeof req.tokenPayload === 'object' && // 1. 타입이 'object'이고
    req.tokenPayload !== null && // 2. null이 아니며
    'userId' in req.tokenPayload // 3. 내부에 'id' 속성이 있는지 확인
  );
}

export function hasId(req: Request): req is Request & { parsedId: { id: number } } {
  return (
    typeof req.parsedId === 'object' && // 1. parsedId가 객체이고
    req.parsedId !== null && // 2. null이 아니며
    'id' in req.parsedId && // 3. 내부에 'id' 속성이 있고
    typeof req.parsedId.id === 'number' // 4. 그 id의 타입이 숫자인지 확인)
  );
}

export function hasParentId(req: Request): req is Request & { parentId: number } {
  return typeof req.parentId === 'object' && req.parentId !== null && 'id' in req.parentId;
}

export function hasParsedQuery(req: Request): req is Request & {
  parsedQuery: {
    keyword: string;
    page: number;
    pageSize: number;
    sortBy: SortBy;
    searchBy: SearchBy;
  };
} {
  return (
    typeof req.parsedQuery === 'object' &&
    req.parsedQuery !== null &&
    'keyword' in req.parsedQuery &&
    'page' in req.parsedQuery &&
    'pageSize' in req.parsedQuery &&
    'sortBy' in req.parsedQuery &&
    'searchBy' in req.parsedQuery
  );
}

export function hasFile(req: Request): req is Request & { file: File } {
  return (
    typeof req.file === 'object' &&
    req.file !== null &&
    'path' in req.file && // file 객체 안에 path가 있는지 확인
    typeof req.file.path === 'string'
  );
}

export function hasParsedRankQuery(req: Request): req is Request & {
  parsedRankQuery: {
    page: number;
    pageSize: number;
    rankBy: RankBy;
  };
} {
  return (
    typeof req.parsedRankQuery === 'object' &&
    req.parsedRankQuery !== null &&
    'page' in req.parsedRankQuery &&
    'pageSize' in req.parsedRankQuery &&
    'rankBy' in req.parsedRankQuery
  );
}
export function hasParsedUserQuery(req: Request): req is Request & {
  parsedUserQuery: {
    page: number;
    pageSize: number;
  };
} {
  return (
    typeof req.parsedUserQuery === 'object' &&
    req.parsedUserQuery !== null &&
    'page' in req.parsedUserQuery &&
    'pageSize' in req.parsedUserQuery
  );
}

export function hasParsedCurationQuery(req: Request): req is Request & {
  parsedCurationQuery: {
    page: number;
    pageSize: number;
    searchBy: SearchBy;
    keyword: string;
  };
} {
  return (
    typeof req.parsedCurationQuery === 'object' &&
    req.parsedCurationQuery !== null &&
    'page' in req.parsedCurationQuery &&
    'pageSize' in req.parsedCurationQuery &&
    'searchBy' in req.parsedCurationQuery &&
    'keyword' in req.parsedCurationQuery
  );
}
