"use client";

import { FC, Fragment, useState } from "react";
import style from "./Menu.module.css";

import { IMenuItem } from "@/types";
import { Poppins } from "@/fonts";
import { MenuItem } from "../MenuItem";

import heartIcon from "../../../public/heart.svg";
import swapIcon from "../../../public/swap.svg";
import trophyIcon from "../../../public/trophy.svg";
import userIcon from "../../../public/user.svg";
import stackIcon from "../../../public/stack.svg";
import settingsIcon from "../../../public/settings.svg";
import quitIcon from "../../../public/quit.svg";
import classNames from "classnames";

const menuItems: IMenuItem[] = [
  {
    name: "My profile",
    link: "me",
    imageSrc: heartIcon.src,
  },
  {
    name: "Reviews",
    link: "reviews",
    imageSrc: swapIcon.src,
  },
  {
    name: "Challenge",
    link: "challenge",
    imageSrc: trophyIcon.src,
  },
  {
    name: "Friends",
    link: "friends",
    imageSrc: userIcon.src,
  },
  {
    name: "Collections",
    link: "collections",
    imageSrc: stackIcon.src,
  },
];

const buttonMenuItems: IMenuItem[] = [
  {
    name: "Settings",
    link: "settings",
    imageSrc: settingsIcon.src,
  },
  {
    name: "Quit",
    link: "/login",
    imageSrc: quitIcon.src,
    sideAction: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("user_id");
      }
    },
  },
];

export interface MenuProps {
  backgroundColor?: string;
}

export const Menu: FC<MenuProps> = ({ backgroundColor }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Fragment>
      <div className={style.fakeMenu}></div>

      <div
        className={classNames(style.menu, {
          [style.isOpen]: isOpen,
        })}
        onMouseEnter={() => {
          if (!isOpen) {
            setIsOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (isOpen) {
            setIsOpen(false);
          }
        }}
        style={{ backgroundColor }}
      >
        <div className={style.menuItemsWrapper}>
          {menuItems.map((item) => (
            <MenuItem key={item.name} {...item} isOnlyIcon={!isOpen} />
          ))}
        </div>

        <div className={style.menuItemsWrapper}>
          {buttonMenuItems.map((item) => (
            <MenuItem key={item.name} {...item} isOnlyIcon={!isOpen} />
          ))}
        </div>
      </div>
    </Fragment>
  );
};
