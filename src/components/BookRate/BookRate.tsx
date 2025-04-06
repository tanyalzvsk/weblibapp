import { FC, useEffect, useState, useContext } from "react";
import style from "./BookRate.module.css";
import { Rate, Flex } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { ThemeContext } from "@/utils";

export interface BookRateProps {
  onRateChange: (newRate: number) => void;
}

export const BookRate: FC<BookRateProps> = ({ onRateChange }) => {
  const [myRate, setMyRate] = useState<number>(1);
  const { currentTheme, toggleTheme } = useContext(ThemeContext);
  useEffect(() => {
    const savedRate = localStorage.getItem("userBookRating");

    if (savedRate) {
      setMyRate(Number(savedRate));
    }
  }, []);

  
  const handleRateChange = (value: number) => {
    setMyRate(value);
    onRateChange(value);
    localStorage.setItem("userBookRating", value.toString());
  };

  return (
    <Flex className={style.rate}>
      <Rate
        character={<HeartOutlined />}
        value={myRate}
        onChange={handleRateChange}
        style={{ color: currentTheme === 'dark' ? '#6c5ce7cc' : 'rgba(64, 4, 4, 0.9)', fontSize: "36px" }}
      />
    </Flex>
  );
};
