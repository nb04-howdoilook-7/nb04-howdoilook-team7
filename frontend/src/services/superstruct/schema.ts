import { number, object, string, Describe, array, enums, partial, type, Struct } from 'superstruct'
import { CategoryKey, CategoryValue, CategoryValueField } from '../types'

// enum
export const CategoryKeySchema: Describe<CategoryKey> = enums(Object.values(CategoryKey))
export const CategoryValueFieldSchema: Describe<CategoryValueField> = enums(Object.values(CategoryValueField))

// 공통
export const CategoryValueSchema: Describe<CategoryValue> = object({
  [CategoryValueField.name]: string(),
  [CategoryValueField.brand]: string(),
  [CategoryValueField.price]: number(),
})

export const generatePaginationSchema = <T extends Struct<any, any>>(dataSchema: T) => object({
  currentPage: number(),
  totalPages: number(),
  totalItemCount: number(),
  data: array(dataSchema),
})

const StyleUserSchema = object({
  id: number(),
  nickname: string(),
})

// style - data
export const GalleryStyleSchema = type({
  id: number(),
  thumbnail: string(),
  tags: array(string()),
  title: string(),
  content: string(),
  user: StyleUserSchema,
  viewCount: number(),
  curationCount: number(),
  categories: partial(
    object({
      [CategoryKey.top]: CategoryValueSchema,
      [CategoryKey.bottom]: CategoryValueSchema,
      [CategoryKey.outer]: CategoryValueSchema,
      [CategoryKey.dress]: CategoryValueSchema,
      [CategoryKey.shoes]: CategoryValueSchema,
      [CategoryKey.bag]: CategoryValueSchema,
      [CategoryKey.accessory]: CategoryValueSchema,
    }),
  ),
})


export const StyleDetailSchema = type({
  id: number(),
  imageUrls: array(string()),
  tags: array(string()),
  title: string(),
  content: string(),
  user: StyleUserSchema,
  viewCount: number(),
  curationCount: number(),
  categories: partial(
    object({
      [CategoryKey.top]: CategoryValueSchema,
      [CategoryKey.bottom]: CategoryValueSchema,
      [CategoryKey.outer]: CategoryValueSchema,
      [CategoryKey.dress]: CategoryValueSchema,
      [CategoryKey.shoes]: CategoryValueSchema,
      [CategoryKey.bag]: CategoryValueSchema,
      [CategoryKey.accessory]: CategoryValueSchema,
    }),
  ),
})

// style - form
export const StyleFormSchema = type({
  imageUrls: array(string()),
  tags: array(string()),
  title: string(),
  content: string(),
  categories: partial(
    object({
      [CategoryKey.top]: CategoryValueSchema,
      [CategoryKey.bottom]: CategoryValueSchema,
      [CategoryKey.outer]: CategoryValueSchema,
      [CategoryKey.dress]: CategoryValueSchema,
      [CategoryKey.shoes]: CategoryValueSchema,
      [CategoryKey.bag]: CategoryValueSchema,
      [CategoryKey.accessory]: CategoryValueSchema,
    }),
  ),
})

// curation - data
export const CurationSchema = type({
  id: number(),
  title: string(),
  content: string(),
  nickname: string(),
  viewCount: number(),
  commentCount: number(),
  createdAt: string(),
})

export const CurationDetailSchema = type({
  id: number(),
  title: string(),
  content: string(),
  nickname: string(),
  viewCount: number(),
  commentCount: number(),
  createdAt: string(),
  styles: array(GalleryStyleSchema),
})

// curation - form
export const CurationFormSchema = type({
  title: string(),
  content: string(),
  nickname: string(),
  password: string(),
  styleIds: array(number()),
})

// comment - data
export const CommentSchema = type({
  id: number(),
  content: string(),
  nickname: string(),
  createdAt: string(),
})

// comment - form
export const CommentFormSchema = type({
  content: string(),
  nickname: string(),
  password: string(),
})

// ranking
export const RankingStyleSchema = type({
  id: number(),
  thumbnail: string(),
  title: string(),
  viewCount: number(),
  curationCount: number(),
})

// user
export const UserProfileSchema = type({
  id: number(),
  email: string(),
  nickname: string(),
})

export const LoginFormSchema = type({
  email: string(),
  password: string(),
})

export const SignupFormSchema = type({
  email: string(),
  nickname: string(),
  password: string(),
  passwordConfirmation: string(),
})