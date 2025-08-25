"use client";

import classNames from "classnames/bind";
import styles from "./OptionButtonsLayout.module.scss";

const cx = classNames.bind(styles);

type OptionButtonsLayoutProps = {
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickCopy?: () => void;
};

const OptionButtonsLayout = ({
  onClickEdit,
  onClickDelete,
  onClickCopy,
}: OptionButtonsLayoutProps) => {
  return (
    <div className={cx("container")}>
      {onClickCopy && (
        <button onClick={onClickCopy} className={cx("button")}>
          복사하기
        </button>
      )}
      <button onClick={onClickEdit} className={cx("button")}>
        수정하기
      </button>
      <button onClick={onClickDelete} className={cx("button")}>
        삭제하기
      </button>
    </div>
  );
};

export default OptionButtonsLayout;
