import classNames from "classnames/bind";
import styles from "./CuratingLayout.module.scss";
import { CuratingType } from "@services/types";
import Icon from "@libs/shared/icon/Icon";
import CommentCreateButton from "../feature-comment/CommentCreateButon";
import Comment from "../feature-comment/Comment";
import checkIsNotEmpty from "@libs/shared/util-util/checkIsNotEmpty";
import Image from "next/image";

const cx = classNames.bind(styles);

type CuratingLayoutProps = {
  curating: CuratingType;
  optionButtons: React.ReactNode;
};

const CuratingLayout = ({ curating, optionButtons }: CuratingLayoutProps) => {
  const {
    user,
    content,
    trendy,
    personality,
    practicality,
    costEffectiveness,
    comments,
  } = curating;
  const points = [
    { point: trendy, text: "트렌디" },
    { point: personality, text: "개성" },
    { point: practicality, text: "실용성" },
    { point: costEffectiveness, text: "가성비" },
  ];

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("curatorInfo")}>
          {user?.profileImage && (
            <Image
              src={user.profileImage}
              width={32}
              height={32}
              alt="user-profile"
              className={cx("profileImage")}
            />
          )}
          <h3 className={cx("left")}>
            {user?.nickname ?? "탈퇴한 큐레이터"}
            <span className={cx("curator")}>큐레이터</span>
          </h3>
        </div>
        <div className={cx("right")}>{optionButtons}</div>
      </div>
      <div className={cx("pointsContainer")}>
        {points.map(({ point, text }) => (
          <div key={text} className={cx("pointCategoryContainer")}>
            <Icon name="arrow" width={8} height={8} alt="점수 항목 글머리" />
            <h4 className={cx("name")}>{text}</h4>
            <p className={cx("score")}>{`${point}점`}</p>
          </div>
        ))}
      </div>
      <div className={cx("contentContainer")}>
        <div className={cx("contentHeader")}>
          <Icon
            name="toggle-arrow"
            width={12}
            height={8}
            alt="한줄 큐레이팅 글머리"
          />
          <h4 className={cx("contentTitle")}>한줄 큐레이팅</h4>
        </div>
        <p className={cx("content")}>{content}</p>
      </div>
      {checkIsNotEmpty(comments) ? (
        <div className={cx("commentWrapper")}>
          <Comment comment={comments} />
        </div>
      ) : (
        <div className={cx("postCommentButtonWrapper")}>
          <CommentCreateButton curating={curating} />
        </div>
      )}
    </div>
  );
};

export default CuratingLayout;
