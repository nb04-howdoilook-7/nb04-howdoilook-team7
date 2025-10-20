import type { CurationId } from './curations.types.js';
import type { UserId } from './users.types.js';

export interface CommentId {
  commentId: number;
}

export interface PostComment extends UserId, CurationId {
  content: string;
}

export interface PutComment extends UserId, CommentId {
  content: string;
}

export interface DeleteComment extends UserId, CommentId {}
