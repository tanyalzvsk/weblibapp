"use client";

import { FC, useState } from "react";
import style from "./BookInfoSection.module.css";
import { IBook } from "@/types";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { BookRate } from "../BookRate";
import { Rating } from "../ReviewForm";
import { Typography, Switch, Flex } from "antd";
const { Title, Text, Paragraph } = Typography;

export interface BookInfoSectionProps extends IBook {}

export const BookInfoSection: FC<BookInfoSectionProps> = ({
  name,
  author,
  rate,
  annotation,
}) => {
  const [currentRate, setCurrentRate] = useState<Rating | number>(rate);
  const [ellipsis, setEllipsis] = useState(true);

  return (
    <div className={style.section}>
      <div className={style.content}>
        <div className={style.info}>
          <Title style = {{color : "white"}} className={classNames(style.title, Poppins.className)}>
            {name}
          </Title>

          <Text className={classNames(style.subtitle, Poppins.className)}>
            by {author}
          </Text>
        </div>

        <Flex className={style.rate}>
          <Title
            level={2}
            className={classNames(style.rating, Poppins.className)}
          >
            {currentRate}
          </Title>

          <BookRate
            onRateChange={(newRate) => {
              setCurrentRate(newRate);
            }}
          />
        </Flex>
      </div>

      <Flex className={classNames(style.switchContainer)}>
        <Switch
          style={{
            width: "40px",
            backgroundColor: ellipsis ? "#ccc" : "rgb(31, 27, 27, 0.7)",
          }}
          checked={!ellipsis}
          onChange={() => {
            setEllipsis(!ellipsis);
          }}
        />
        <Paragraph
          style={{
            maxHeight: ellipsis ? "50px" : "none",
            overflow: ellipsis ? "hidden" : "visible",
            transition: "max-height 0.3s ease",
          }}
          className={classNames(style.annotation, Poppins.className)}
        >
          {annotation}
        </Paragraph>
      </Flex>
    </div>
  );
};
