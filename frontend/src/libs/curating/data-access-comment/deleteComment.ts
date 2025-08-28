'use server'

import { deleteComment as deleteCommentApi } from '@services/api'
import { revalidateTag } from 'next/cache'

const deleteComment = async (commentId: number) => {
  const response = await deleteCommentApi(commentId)

  revalidateTag('curatings')

  return response
}

export default deleteComment
