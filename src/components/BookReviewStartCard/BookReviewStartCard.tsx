"use client";

import { FC, useContext, useMemo } from "react";
import Image from "next/image";
import style from "./BookReviewStartCard.module.css";
import pen from "../../../public/pen.svg";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { ThemeContext } from "@/utils/ThemeContext";

export interface BookReviewStartCardProps {}

export const BookReviewStartCard: FC<BookReviewStartCardProps> = ({}) => {
  const { currentTheme, toggleTheme } = useContext(ThemeContext);
  const reviewThemeClassName = useMemo(() => {
    return "card-" + currentTheme;
  }, [currentTheme]);

  return (
    <div className={classNames(style.card, style[reviewThemeClassName])}>
      <h4 className={classNames(style.title, Poppins.className)}>
        Don&#39;t wait! Write your own review
      </h4>

      <div className={style.icon}>
        <Image src={pen} alt="pen" fill />
      </div>
    </div>
  );
};
