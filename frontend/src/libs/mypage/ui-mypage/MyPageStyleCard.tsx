import classNames from "classnames/bind";
import styles from "./MyPageStyleCard.module.scss";
import { GalleryStyle } from "@services/types";
import Image from "next/image";
import Link from "next/link";
import Icon from "@libs/shared/icon/Icon";
import { STYLE_CATEGORY_TITLE_MAP } from "@libs/shared/util-constants/constants";

const cx = classNames.bind(styles);

type MyPageStyleCardProps = {
  card: GalleryStyle;
};

const MyPageStyleCard = ({ card }: MyPageStyleCardProps) => {
  const {
    id,
    thumbnail,
    title,
    categories = {},
    tags = [],
    viewCount,
    curationCount,
  } = card;

  return (
    <div className={cx("container")}>
      <Link href={`/styles/${id}`} className={cx("imageContainer")}>
        <Image
          src={thumbnail}
          alt={title}
          width={220}
          height={300}
          className={cx("image")}
          priority
        />
        <div className={cx("categories")}>
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className={cx("category")}>
              <div className={cx("categoryNameContainer")}>
                <Icon
                  name="arrow"
                  width={8}
                  height={8}
                  alt="카테고리 제목 글머리"
                />
                <h4>{STYLE_CATEGORY_TITLE_MAP[key]}</h4>
              </div>
              <p
                className={cx("categoryInfo")}
              >{`${category.name}, ${category.brand}`}</p>
            </div>
          ))}
        </div>
      </Link>
      <div className={cx("body")}>
        <div className={cx("tagsContainer")}>
          {tags.map((tag) => (
            <span key={tag}>{`#${tag}`}</span>
          ))}
        </div>
        <h2 className={cx("title")}>
          <Link href={`/styles/${id}`}>{title}</Link>
        </h2>
      </div>
      <div className={cx("footer")}>
        <div className={cx("count")}>
          <Icon name="eye" height={16} width={16} alt="조회수 아이콘" />
          <span>{viewCount}</span>
        </div>
        <div className={cx("count")}>
          <Icon name="heart" height={16} width={16} alt="좋아요 아이콘" />
          <span>{card.likeCount}</span>
        </div>
        <div className={cx("count")}>
          <Icon name="chat" height={16} width={16} alt="큐레이팅수 아이콘" />
          <span>{curationCount}</span>
        </div>
      </div>
    </div>
  );
};

export default MyPageStyleCard;
