"use client";

import { FC, useCallback, useMemo } from "react";
import style from "./ReviewCard.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { IReview } from "@/types";
import { generateRandomColor } from "@/utils";
import { useRouter } from "next/navigation";
import { Pages } from "@/constants";

export interface ReviewCardProps extends IReview {
  backgroundColor?: string;
}

export const ReviewCard: FC<ReviewCardProps> = ({
  review_id,
  name,
  rating,
  description,
  backgroundColor = "",
}) => {
  const bgColor: string = useMemo(() => {
    return generateRandomColor();
  }, []);

  const router = useRouter();

  const handleClick = useCallback(
    (id: number) => {
      router.replace(Pages.review + "/" + id);
    },
    [router]
  );

  return (
    <div
      className={style.card}
      onClick={() => {
        handleClick(review_id);
      }}
      style={{ backgroundColor: backgroundColor ? backgroundColor : bgColor }}
    >
      <div className={style.info}>
        <h4 className={classNames(style.title, Poppins.className)}>
          {name}
          <span className={style.subtitle}> writes:</span>
        </h4>

        <p className={classNames(style.rating, Poppins.className)}>{rating}</p>
      </div>

      <p className={classNames(style.description, Poppins.className)}>
        {description}
      </p>
    </div>
  );
};
