"use client";

import classNames from "classnames/bind";
import styles from "./OptionButtonsLayout.module.scss";

const cx = classNames.bind(styles);

type OptionButtonsLayoutProps = {
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onClickLike?: () => void;
  onClickShare?: () => void;
};

const OptionButtonsLayout = ({
  onClickEdit,
  onClickDelete,
  onClickLike,
  onClickShare,
}: OptionButtonsLayoutProps) => {
  return (
    <div className={cx("container")}>
      {onClickLike && (
        <button onClick={onClickLike} className={cx("button")}>
          좋아요
        </button>
      )}
      {onClickShare && (
        <button onClick={onClickShare} className={cx("button")}>
          공유하기
        </button>
      )}
      {onClickEdit && (
        <button onClick={onClickEdit} className={cx("button")}>
          수정하기
        </button>
      )}
      {onClickDelete && (
        <button onClick={onClickDelete} className={cx("button")}>
          삭제하기
        </button>
      )}
    </div>
  );
};

export default OptionButtonsLayout;
