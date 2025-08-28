'use client'

import FormModal from '@libs/shared/modal/form-modal/FormModal'
import useModal from '@libs/shared/modal/useModal'
import CommentForm from './CommentForm'
import { CommentFormInput, CuratingType } from '@services/types'
import useConfirmModal from '@libs/shared/modal/useConfirmModal'
import postComment from '../data-access-comment/postComment'
import { useAuth } from '@context/AuthContext'

type CommentCreateButtonProps = {
  curating: CuratingType;
}

const CommentCreateButton = ({ curating }: CommentCreateButtonProps) => {
  const { user: authUser, isLoggedIn } = useAuth() // 작성자인지 확인 로직
  const { closeModal, modalRef, openModal } = useModal()
  const { renderConfirmModal, openConfirmModal } = useConfirmModal()

  const handleCreateComment = async (data: CommentFormInput) => {
    try {
      await postComment(curating.id, data)
      closeModal()
      openConfirmModal({
        description: '답글 등록이 완료되었습니다.',
      })
    } catch (error) {
      openConfirmModal({
        description: '답글 등록에 실패했습니다.',
      })
    }
  }
  // 로그인 했는지 확인
  if (!isLoggedIn || authUser === undefined) {
    return null
  }
  // 로그인한 id와 작성자 id가 다를경우 버튼이 안보이는 로직
  const isOwner = authUser && authUser.id === curating.userId
  if (!isOwner) {
    return null
  }

  return (
    <>
      <button
        onClick={() => {
          openModal()
        }}
      >
        <span>답글 달기</span>
      </button>
      <FormModal
        ref={modalRef}
        onClose={closeModal}
        title="답글"
        content={<CommentForm onSubmit={handleCreateComment} />}
      />
      {renderConfirmModal()}
    </>
  )
}

export default CommentCreateButton
