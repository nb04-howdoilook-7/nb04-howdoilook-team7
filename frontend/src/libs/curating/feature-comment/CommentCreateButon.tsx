'use client'

import FormModal from '@libs/shared/modal/form-modal/FormModal'
import useModal from '@libs/shared/modal/useModal'
import CommentForm from './CommentForm'
import { CommentFormInput, CuratingType } from '@services/types'
import useConfirmModal from '@libs/shared/modal/useConfirmModal'
import postComment from '../data-access-comment/postComment'
import { useAuth } from '@context/AuthContext'
import { useRouter } from 'next/navigation'

type CommentCreateButtonProps = {
  curating: CuratingType
  styleAuthorId: number
}

const CommentCreateButton = ({ curating, styleAuthorId }: CommentCreateButtonProps) => {
  const { user: authUser, isLoggedIn } = useAuth()
  const { closeModal, modalRef, openModal } = useModal()
  const router = useRouter()
  const { renderConfirmModal, openConfirmModal } = useConfirmModal()

  const handleCreateComment = async (data: CommentFormInput) => {
    try {
      await postComment(curating.id, data)
      closeModal()
      openConfirmModal({
        description: '답글 등록이 완료되었습니다.',
        onClose: () => router.refresh(),
      })
    } catch (error) {
      openConfirmModal({
        description: '답글 등록에 실패했습니다.',
      })
    }
  }

  if (!isLoggedIn || authUser === undefined) {
    return null
  }

  const isOwner = authUser && authUser.id === styleAuthorId
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
