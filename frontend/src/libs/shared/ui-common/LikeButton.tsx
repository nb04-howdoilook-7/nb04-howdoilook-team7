"use client";

import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./LikeButton.module.scss";
import Icon from "@libs/shared/icon/Icon";

const cx = classNames.bind(styles);

const LikeButton = () => {
  const [isLiked, setIsLiked] = useState(false); // 초기 상태는 빈 하트

  const handleClick = () => {
    setIsLiked((prev) => !prev); // 클릭 시 상태 토글
  };

  return (
    <button onClick={handleClick} className={cx("likeButton")}>
      <Icon name={isLiked ? "heart2" : "heart1"} width={24} height={24} alt="좋아요" />
    </button>
  );
};

export default LikeButton;
