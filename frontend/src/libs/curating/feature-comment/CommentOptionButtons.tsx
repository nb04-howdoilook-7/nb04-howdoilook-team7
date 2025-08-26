'use client'

import OptionButtonsLayout from '@libs/shared/layout/OptionButtonsLayout'
import useModal from '@libs/shared/modal/useModal'
import { CommentFormInput, CommentType } from '@services/types'
import CommentForm from './CommentForm'
import FormModal from '@libs/shared/modal/form-modal/FormModal'
import useConfirmModal from '@libs/shared/modal/useConfirmModal'
import putComment from '../data-access-comment/putComment'
import deleteComment from '../data-access-comment/deleteComment'

type CommentOptionButtonsProps = {
  comment: CommentType
}

const CommentOptionButtons = ({ comment }: CommentOptionButtonsProps) => {
  const commentEditFormModal = useModal()
  const { renderConfirmModal, openConfirmModal } = useConfirmModal()

  const handleEditComment = async (data: CommentFormInput) => {
    try {
      await putComment(comment.id, data)
      commentEditFormModal.closeModal()
      openConfirmModal({
        description: '답글 수정이 완료되었습니다.',
      })
    } catch (error) {
      openConfirmModal({
        description: '답글 수정에 실패했습니다.',
      })
    }
  }

  const handleDeleteComment = async () => {
    try {
      await deleteComment(comment.id)
      openConfirmModal({
        description: '답글 삭제가 완료되었습니다.',
      })
    } catch (error) {
      openConfirmModal({
        description: '답글 삭제에 실패했습니다.',
      })
    }
  }

  return (
    <>
      <OptionButtonsLayout
        onClickEdit={() => { commentEditFormModal.openModal() }}
        onClickDelete={() => {
          openConfirmModal({
            description: '답글을 정말 삭제하시겠습니까?',
            onConfirm: handleDeleteComment,
          })
        }}
      />
      <FormModal
        ref={commentEditFormModal.modalRef}
        onClose={commentEditFormModal.closeModal}
        title='답글'
        content={(
          <CommentForm
            onSubmit={handleEditComment}
            onClose={commentEditFormModal.closeModal}
            defaultValues={{
              content: comment.content,
            }}
          />
        )}
      />
      {renderConfirmModal()}
    </>
  )
}

export default CommentOptionButtons
