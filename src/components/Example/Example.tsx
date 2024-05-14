"use client";

import { FC } from "react";
import style from "./Example.module.css";

export interface ExampleProps {}

export const Example: FC<ExampleProps> = ({}) => {
  return <div className={style.example}></div>;
};
