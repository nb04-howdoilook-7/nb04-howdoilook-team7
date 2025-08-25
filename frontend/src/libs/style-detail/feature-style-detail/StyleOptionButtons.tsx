"use client";

import OptionButtonsLayout from "@libs/shared/layout/OptionButtonsLayout";
import FormModal from "@libs/shared/modal/form-modal/FormModal";
import useModal from "@libs/shared/modal/useModal";
import { useRouter } from "next/navigation";
import StyleDeleteForm from "./StyleDeleteForm";
import useConfirmModal from "@libs/shared/modal/useConfirmModal";
import deleteStyle from "../data-access-style-detail/deleteStyle";
import { StyleDeleteFormInput } from "@services/types";

type StyleOptionButtonsProps = {
  styleId: number;
};

const StyleOptionButtons = ({ styleId }: StyleOptionButtonsProps) => {
  const styleDeleteFormModal = useModal();
  const { renderConfirmModal, openConfirmModal } = useConfirmModal();
  const router = useRouter();

  const handleEditStyle = () => {
    router.push(`/styles/${styleId}/edit`);
  };

  const handleDeleteStyle = async (data: StyleDeleteFormInput) => {
    try {
      await deleteStyle(styleId, data);
      openConfirmModal({
        description:
          "스타일 삭제가 완료되었습니다. 갤러리 페이지로 이동합니다.",
        onClose: () => {
          router.push("/");
          router.refresh();
        },
      });
      styleDeleteFormModal.closeModal();
    } catch (error) {
      openConfirmModal({
        description: "스타일 삭제에 실패했습니다.",
      });
    }
  };

  const handleLikeStyle = () => {
    openConfirmModal({
      description: "좋아요 버튼 클릭 (기능 구현 예정)",
    });
  };

  const handleShareStyle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        openConfirmModal({
          description: "스타일 공유에 실패했습니다.",
        });
      }
    } else {
      openConfirmModal({
        description: "URL 복사에 실패했습니다. (Web Share API 미지원)",
      });
    }
  };

  return (
    <>
      <OptionButtonsLayout
        onClickEdit={() => {
          handleEditStyle();
        }}
        onClickDelete={() => {
          styleDeleteFormModal.openModal();
        }}
        onClickLike={handleLikeStyle}
        onClickShare={handleShareStyle}
      />
      <FormModal
        ref={styleDeleteFormModal.modalRef}
        onClose={styleDeleteFormModal.closeModal}
        title="삭제 권한 인증"
        content={
          <StyleDeleteForm
            onSubmit={handleDeleteStyle}
            onClose={styleDeleteFormModal.closeModal}
          />
        }
      />
      {renderConfirmModal()}
    </>
  );
};

export default StyleOptionButtons;
