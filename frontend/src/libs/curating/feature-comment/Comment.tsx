import { CommentType } from '@services/types'
import CommentLayout from '../ui-comment/CommentLayout'
import CommentOptionButtons from './CommentOptionButtons'

type CommentProps = {
  comment: CommentType
  styleAuthorId: number
}

const Comment = ({ comment, styleAuthorId }: CommentProps) => {
  return (
    <CommentLayout
      comment={comment}
      optionButtons={<CommentOptionButtons comment={comment} />}
      styleAuthorId={styleAuthorId}
    />
  )
}

export default Comment
