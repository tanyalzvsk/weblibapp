import { FC } from "react";
import Image from "next/image";
import style from "./WriteReviewButton.module.css";
import { Poppins } from "@/fonts";
import penIcon from "../../../public/pen.svg";
import classNames from "classnames";

export interface WriteReviewButtonProps {
  handleClick?: () => void;
}

export const WriteReviewButton: FC<WriteReviewButtonProps> = ({
  handleClick,
}) => {
  return (
    <div className={style.card} onClick={handleClick}>
      <p className={classNames(style.info, Poppins.className)}>
        Don’t wait! Write your own review
      </p>

      <Image className={style.penIcon} src={penIcon} alt="pen" />
    </div>
  );
};
