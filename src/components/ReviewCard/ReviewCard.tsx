"use client";

import { FC, useMemo } from "react";
import style from "./ReviewCard.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { IReview } from "@/types";
import { generateRandomColor } from "@/utils";

export interface ReviewCardProps extends IReview {
  backgroundColor?: string;
}

export const ReviewCard: FC<ReviewCardProps> = ({
  name,
  rating,
  description,
  backgroundColor = " ",
}) => {
  const bgColor: string = useMemo(() => {
    return generateRandomColor();
  }, []);

  return (
    <div
      className={style.card}
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
