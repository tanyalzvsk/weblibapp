"use client";

import { FC, useState } from "react";
import style from "./BookInfoSection.module.css";
import { IBook } from "@/types";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { BookRate } from "../BookRate";
import { Rating } from "../ReviewForm";

export interface BookInfoSectionProps extends IBook {}

export const BookInfoSection: FC<BookInfoSectionProps> = ({
  name,
  author,
  rate,
  annotation,
}) => {
  const [currentRate, setCurrentRate] = useState<Rating | number>(rate);

  return (
    <div className={style.section}>
      <div className={style.content}>
        <div className={style.info}>
          <h2 className={classNames(style.title, Poppins.className)}>{name}</h2>

          <p className={classNames(style.subtitle, Poppins.className)}>
            by {author}
          </p>
        </div>

        <div className={style.rate}>
          <p className={classNames(style.rating, Poppins.className)}>{currentRate}</p>

          <BookRate
            onRateChange={(newRate) => {
              setCurrentRate(newRate);
            }}
          />
        </div>
      </div>

      <p className={classNames(style.annotation, Poppins.className)}>
        {annotation}
      </p>
    </div>
  );
};
