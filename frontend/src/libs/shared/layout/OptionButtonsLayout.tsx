"use client";

import classNames from "classnames/bind";
import styles from "./OptionButtonsLayout.module.scss";

const cx = classNames.bind(styles);

type OptionButtonsLayoutProps = {
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onClickShare?: () => void;
};

const OptionButtonsLayout = ({
  onClickEdit,
  onClickDelete,
  onClickShare,
}: OptionButtonsLayoutProps) => {
  return (
    <div className={cx("container")}>
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
