"use client";

import { FC, useCallback, useMemo, useContext } from "react";
import style from "./ReviewCard.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { IReview } from "@/types";
import {
  generateRandomColorLight,
  generateRandomColorDark,
  ThemeContext,
} from "@/utils";
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
  book_name = "",
  backgroundColor = "",
}) => {
  const { currentTheme } = useContext(ThemeContext);

  const bgColor: string = useMemo(() => {
    return currentTheme === "light"
      ? generateRandomColorLight()
      : generateRandomColorDark();
  }, [currentTheme]);

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
        <div className={style.wrap}>
          {book_name && (
            <h4 className={classNames(style.title, Poppins.className)}>
              {book_name}
            </h4>
          )}

          <p className={classNames(style.rating, Poppins.className)}>
            {rating}
          </p>
        </div>

        <h4 className={classNames(style.title, Poppins.className)}>
          {name}
          <span className={style.subtitle}> writes: </span>
        </h4>
      </div>

      <p className={classNames(style.description, Poppins.className)}>
        {description}
      </p>
    </div>
  );
};
