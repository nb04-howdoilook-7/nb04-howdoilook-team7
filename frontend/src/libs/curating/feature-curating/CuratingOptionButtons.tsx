'use client'

import OptionButtonsLayout from '@libs/shared/layout/OptionButtonsLayout'
import FormModal from '@libs/shared/modal/form-modal/FormModal'
import useModal from '@libs/shared/modal/useModal'
import { CuratingDeleteFormInput, CuratingFormInput, CuratingType } from '@services/types'
import CuratingForm from './CuratingForm'
import useConfirmModal from '@libs/shared/modal/useConfirmModal'
import putCurating from '../data-access-curating/putCurating'
import deleteCurating from '../data-access-curating/deleteCurating'
import { useRouter } from 'next/navigation'
import useUpdateQueryURL from '@libs/shared/util-hook/useUpdateQueryURL'
import { useAuth } from '@context/AuthContext'

type CuratingOptionButtonsProps = {
  curating: CuratingType
}

const CuratingOptionButtons = ({ curating }: CuratingOptionButtonsProps) => {
  const curatingEditFormModal = useModal()
  const curatingDeleteFormModal = useModal()
  const { renderConfirmModal, openConfirmModal } = useConfirmModal()

  const router = useRouter()
  const { updateQueryURL } = useUpdateQueryURL()
  const { user: authUser, isLoggedIn } = useAuth()

  const handleEditCurating = async (data: CuratingFormInput) => {
    try {
      await putCurating(curating.id, data)
      curatingEditFormModal.closeModal()
      openConfirmModal({
        description: '큐레이팅 수정이 완료되었습니다.',
      })
    } catch (error) {
      openConfirmModal({
        description: '큐레이팅 수정에 실패했습니다.',
      })
    }
  }

  const handleDeleteCurating = async (data: CuratingDeleteFormInput) => {
    try {
      await deleteCurating(curating.id, data)
      router.push(updateQueryURL({ page: 1 }), { scroll: false })
      curatingDeleteFormModal.closeModal()
      openConfirmModal({
        description: '큐레이팅 삭제가 완료되었습니다.',
      })
    } catch (error) {
      openConfirmModal({
        description: '큐레이팅 삭제에 실패했습니다.',
      })
    }
  }

  // If not logged in, or authUser is not yet loaded, don't render buttons
  if (!isLoggedIn || authUser === undefined) {
    return null;
  }

  const isOwner = authUser.id === curating.userId;

  if (!isOwner) {
    return null;
  }

  return (
    <>
      <OptionButtonsLayout
        onClickEdit={() => { curatingEditFormModal.openModal() }}
        onClickDelete={() => { openConfirmModal({ description: '해당 큐레이션을 삭제하시겠습니까?', onConfirm: () => handleDeleteCurating({}) }) }}
      />
      <FormModal
        ref={curatingEditFormModal.modalRef}
        onClose={curatingEditFormModal.closeModal}
        title='큐레이팅'
        content={(
          <CuratingForm
            onSubmit={handleEditCurating}
            defaultValues={{
              trendy: curating.trendy,
              personality: curating.personality,
              practicality: curating.practicality,
              costEffectiveness: curating.costEffectiveness,
              content: curating.content,
              nickname: curating.user.nickname,
            }}
          />
        )}
      />
      
      {renderConfirmModal()}
    </>
  )
}

export default CuratingOptionButtons
