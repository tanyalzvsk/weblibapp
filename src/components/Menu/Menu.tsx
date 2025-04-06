"use client";

import { FC, Fragment, useContext, useMemo, useState } from "react";
import style from "./Menu.module.css";

import { IMenuItem } from "@/types";
import { MenuItem } from "../MenuItem";
import Modal from "react-modal";
import { Poppins } from "@/fonts";
import heartIcon from "../../../public/heart.svg";
import swapIcon from "../../../public/swap.svg";
import trophyIcon from "../../../public/trophy.svg";
import userIcon from "../../../public/user.svg";
import stackIcon from "../../../public/stack.svg";
import menuIcon from "../../../public/menu.svg";
import quitIcon from "../../../public/quit.svg";
import moonIcon from "../../../public/moon.svg";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { UserContext } from "@/utils";
import { ThemeContext } from "@/utils/ThemeContext";

import { Switch, Flex, Avatar, Space } from "antd";

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

export interface MenuProps {
  backgroundColor?: string;
}

export const Menu: FC<MenuProps> = ({ backgroundColor }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [modalIsOpen, setIsModalOpen] = useState<boolean>(false);
  const [ellipsis, setEllipsis] = useState(true);

  const { updateUserId } = useContext(UserContext)!;
  const { currentTheme, toggleTheme } = useContext(ThemeContext);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const buttonMenuItems: IMenuItem[] = [
    {
      name: "Back",
      link: " ",
      imageSrc: menuIcon.src,
    },
    {
      name: "Quit",
      imageSrc: quitIcon.src,
      sideAction: () => {
        openModal();
      },
    },
  ];

  const menuThemeClassName = useMemo(() => {
    return "menu-" + currentTheme;
  }, [currentTheme]);

  return (
    <Fragment>
      <div className={style.fakeMenu}></div>

      <div
        className={classNames(style.menu, style[menuThemeClassName], {
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
          <Flex
            gap={26}
            align="center"
            justify="flex-start"
            style={{ marginLeft: "10px" }}
          >
            <Space size={25} wrap>
              <Avatar src={moonIcon.src}></Avatar>
            </Space>

            <Switch
             
              checked={currentTheme === "dark"}
              onChange={toggleTheme}
            ></Switch>
          </Flex>

          {buttonMenuItems.map((item) => (
            <MenuItem key={item.name} {...item} isOnlyIcon={!isOpen} />
          ))}
        </div>
      </div>

      <Modal
        className={style.quitMenu}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "calc(50% - 50px)",
            left: "calc(50% - 50px)",
            width: "400px",
            height: "200px",
          },
        }}
      >
        <h2 className={classNames(style.quitTitle, Poppins.className)}>
          Do you want to quit?
        </h2>

        <div className={style.buttonsWrapper}>
          <button
            className={classNames(style.quitButton, Poppins.className)}
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.removeItem("user_id");
              }

              closeModal();

              updateUserId(null);

              router.replace("/login");
            }}
          >
            Yes
          </button>
          <button
            className={classNames(style.quitButton, Poppins.className)}
            onClick={closeModal}
          >
            No
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};
