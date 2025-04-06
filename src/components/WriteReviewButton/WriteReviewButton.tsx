import { FC, useContext, useMemo } from "react";
import Image from "next/image";
import style from "./WriteReviewButton.module.css";
import { Poppins } from "@/fonts";
import penIcon from "../../../public/pen.svg";
import classNames from "classnames";
import { ThemeContext } from "@/utils";

export interface WriteReviewButtonProps {
  handleClick?: () => void;
}

export const WriteReviewButton: FC<WriteReviewButtonProps> = ({
  handleClick,
}) => {
  const { currentTheme } = useContext(ThemeContext); 

  const cardThemeClassName = useMemo(() => {
    return "card-" + currentTheme;
  }, [currentTheme]);

  return (
    <div className={classNames(style.card, style[cardThemeClassName])} onClick={handleClick}>
      <p className={classNames(style.info, Poppins.className)}>
        Don’t wait! Write your own review
      </p>
      <Image className={style.penIcon} src={penIcon} alt="pen" />
    </div>
  );
};
