"use client";

import { FC, ReactNode } from "react";
import style from "./PageWrapper.module.css";
import classNames from "classnames";

export interface PageWrapperProps {
  children: ReactNode;
  backgroundSrc: string;
  className?: string;
}

export const PageWrapper: FC<PageWrapperProps> = ({
  children,
  backgroundSrc,
  className = "",
}) => {
  return (
    <div
      className={classNames(style.pageWrapper, className)}
      style={{ backgroundImage: `url(${backgroundSrc})` }}
    >
      {children}
    </div>
  );
};
