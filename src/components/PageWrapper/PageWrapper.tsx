"use client";

import { FC, ReactNode, useMemo, useContext } from "react";
import style from "./PageWrapper.module.css";
import classNames from "classnames";
import { ThemeContext } from "@/utils";

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
  const { currentTheme } = useContext(ThemeContext);
  const themeBackgroundClassname = useMemo(() => {
    return `pageWrapper-${currentTheme}`;
  }, [currentTheme]);
  return (
    <div
      className={classNames(
        style.pageWrapper,
        style[themeBackgroundClassname],
        className
      )}
      style={
        currentTheme === "light"
          ? { backgroundImage: `url(${backgroundSrc})` }
          : {}
      }
    >
      {children}
    </div>
  );
};
