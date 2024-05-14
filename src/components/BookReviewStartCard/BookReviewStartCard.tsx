"use client";

import { FC } from "react";
import Image from "next/image";
import style from "./BookReviewStartCard.module.css";
import pen from "../../../public/pen.svg";
import classNames from "classnames";
import { Poppins } from "@/fonts";

export interface BookReviewStartCardProps {}

export const BookReviewStartCard: FC<BookReviewStartCardProps> = ({}) => {
  return (
    <div className={style.card}>
      <h4 className={classNames(style.title, Poppins.className)}>
        Don&#39;t wait! Write your own review
      </h4>

      <div className={style.icon}>
        <Image src={pen} alt="pen" fill />
      </div>
    </div>
  );
};
