import { FC, useState } from "react";
import style from "./BookRate.module.css";
import classNames from "classnames";
import { Rating } from "../ReviewForm";

export interface BookRateProps {
  onRateChange: (newRate: Rating) => void;
}

const availableRatings: Rating[] = [1, 2, 3, 4, 5];

export const BookRate: FC<BookRateProps> = ({ onRateChange }) => {
  const [myRate, setMyRate] = useState<number>(1);
  const [selectedRate, setSelectedRate] = useState<number>(0);

  return (
    <div className={style.rate}>
      {availableRatings.map((rate) => (
        <div
          key={rate}
          className={classNames(style.rateIcon, {
            [style.selected]: rate <= myRate,
            [style.hovered]: rate <= selectedRate,
          })}
          onClick={() => {
            setMyRate(rate);
            onRateChange(rate);
          }}
          onMouseEnter={() => setSelectedRate(rate)}
          onMouseLeave={() => setSelectedRate(0)}
        />
      ))}
    </div>
  );
};
