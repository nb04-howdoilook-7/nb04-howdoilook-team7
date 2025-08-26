"use client";

import OptionButtonsLayout from "@libs/shared/layout/OptionButtonsLayout";
import useModal from "@libs/shared/modal/useModal";
import { CommentFormInput, CommentType } from "@services/types";
import CommentForm from "./CommentForm";
import FormModal from "@libs/shared/modal/form-modal/FormModal";
import useConfirmModal from "@libs/shared/modal/useConfirmModal";
import putComment from "../data-access-comment/putComment";
import deleteComment from "../data-access-comment/deleteComment";
import { useAuth } from "@context/AuthContext";

type CommentOptionButtonsProps = {
  comment: CommentType;
};

const CommentOptionButtons = ({ comment }: CommentOptionButtonsProps) => {
  const { user: authUser, isLoggedIn } = useAuth(); // 작성자인지 확인 로직
  const commentEditFormModal = useModal();
  const { renderConfirmModal, openConfirmModal } = useConfirmModal();

  const handleEditComment = async (data: CommentFormInput) => {
    try {
      await putComment(comment.id, data);
      commentEditFormModal.closeModal();
      openConfirmModal({
        description: "답글 수정이 완료되었습니다.",
      });
    } catch (error) {
      openConfirmModal({
        description: "답글 수정에 실패했습니다.",
      });
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(comment.id);
      alert("답글 삭제가 완료되었습니다."); // modal 대신 alert 사용
      // openConfirmModal({
      //   description: "답글 삭제가 완료되었습니다.",
      // });
    } catch (error) {
      openConfirmModal({
        description: "답글 삭제에 실패했습니다.",
      });
    }
  };
  // 로그인 했는지 확인
  if (!isLoggedIn || authUser === undefined) {
    return null;
  }
  // 로그인한 id와 작성자 id가 다를경우 버튼이 안보이는 로직
  const isOwner = authUser.id === comment.userId;
  if (!isOwner) {
    return null;
  }

  return (
    <>
      <OptionButtonsLayout
        onClickEdit={() => {
          commentEditFormModal.openModal();
        }}
        onClickDelete={() => {
          openConfirmModal({
            description: "답글을 정말 삭제하시겠습니까?",
            onConfirm: handleDeleteComment,
          });
        }}
      />
      <FormModal
        ref={commentEditFormModal.modalRef}
        onClose={commentEditFormModal.closeModal}
        title="답글"
        content={
          <CommentForm
            onSubmit={handleEditComment}
            onClose={commentEditFormModal.closeModal}
            defaultValues={{
              content: comment.content,
            }}
          />
        }
      />
      {renderConfirmModal()}
    </>
  );
};

export default CommentOptionButtons;
