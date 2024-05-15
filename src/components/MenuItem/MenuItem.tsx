"use client";

import { FC, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { IMenuItem } from "@/types";

import style from "./MenuItem.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";

export interface MenuItemProps extends IMenuItem {
  isOnlyIcon?: boolean;
}

export const MenuItem: FC<MenuItemProps> = ({
  name,
  link,
  imageSrc,
  isOnlyIcon = true,
  sideAction,
}) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (sideAction) {
      sideAction();
    }

    if (link) {
      router.replace(`/${link}`);
    }
  }, [link, router, sideAction]);

  return (
    <div className={style.menuItemWrapper} onClick={handleClick}>
      <div className={style.iconWrapper}>
        <Image
          className={style.menuItemIcon}
          src={imageSrc}
          alt={name}
          width={24}
          height={24}
        />
      </div>

      {!isOnlyIcon && (
        <p className={classNames(style.menuItemName, Poppins.className)}>
          {name}
        </p>
      )}
    </div>
  );
};
