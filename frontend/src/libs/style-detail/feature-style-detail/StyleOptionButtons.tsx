'use client'

import OptionButtonsLayout from '@libs/shared/layout/OptionButtonsLayout'
import { useRouter } from 'next/navigation'
import useConfirmModal from '@libs/shared/modal/useConfirmModal'
import deleteStyle from '../data-access-style-detail/deleteStyle'
import { useAuth } from '@context/AuthContext'

type StyleOptionButtonsProps = {
  styleId: number
  user: { id: number; nickname: string } // The user who owns the style
}

const StyleOptionButtons = ({ styleId, user }: StyleOptionButtonsProps) => {
  const { renderConfirmModal, openConfirmModal } = useConfirmModal()
  const router = useRouter()
  const { user: authUser, isLoggedIn } = useAuth()

  const isOwner = isLoggedIn && authUser?.id === user.id

  const handleDeleteStyle = async () => {
    console.log('handleDeleteStyle called');
    try {
      console.log('Calling deleteStyle...');
      await deleteStyle(styleId)
      console.log('deleteStyle succeeded!');
      openConfirmModal({
        description: '스타일 삭제가 완료되었습니다. 갤러리 페이지로 이동합니다.',
        onClose: () => {
          router.push('/')
          router.refresh()
        },
      })
    } catch (error) {
      console.error('deleteStyle failed:', error);
      openConfirmModal({
        description: '스타일 삭제에 실패했습니다.',
      })
    }
  }

  const handleEditStyle = () => {
    router.push(`/styles/${styleId}/edit`)
  }

  const openDeleteConfirm = () => {
    openConfirmModal({
      description: '정말로 이 스타일을 삭제하시겠습니까?',
      onConfirm: handleDeleteStyle,
    })
  }

  if (!isOwner) {
    return null
  }

  return (
    <>
      <OptionButtonsLayout
        onClickEdit={handleEditStyle}
        onClickDelete={openDeleteConfirm}
      />
      {renderConfirmModal()}
    </>
  )
}

export default StyleOptionButtons