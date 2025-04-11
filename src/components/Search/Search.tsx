"use client";

import { FC, useCallback, useContext, useState, useMemo } from "react";
import Image from "next/image";
import style from "./Search.module.css";

import searchIcon from "../../../public/search-glass.svg";
import searchDeleteIcon from "../../../public/search-delete.svg";
import { API_URL } from "@/constants";
import { ISearchData } from "@/types/SearchData";
import { UserContext } from "@/utils";
import { Poppins } from "@/fonts";
import classNames from "classnames";

import { ThemeContext } from "@/utils/ThemeContext";
import { toast, Bounce } from "react-toastify";

export interface SearchProps {
  handleDateChange: (data: ISearchData) => void;
}

export const Search: FC<SearchProps> = ({ handleDateChange }) => {
  const [value, setValue] = useState<string>("");
  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;
  const { currentTheme } = useContext(ThemeContext);

  const handleSearch = useCallback(
    async (id: number) => {
      const booksResponse = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          query: value,
          user_id: id,
        }),
      });

      const searchData: ISearchData = await booksResponse.json();

      console.log("search data", searchData);

      if (!searchData.success && searchData.message) {
        toast(searchData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      handleDateChange(searchData);
    },
    [handleDateChange, value, accessToken, refreshToken]
  );

  const handleSb = () => {
    setValue("");
  };

  const searchThemeClassName = useMemo(() => {
    return "search-" + currentTheme;
  }, [currentTheme]);

  const searchInputThemeClassName = useMemo(() => {
    return "searchInput-" + currentTheme;
  }, [currentTheme]);

  return (
    <div className={classNames(style.search, style[searchThemeClassName])}>
      <button
        className={classNames(style.searchButton, Poppins.className)}
        onClick={() => {
          if (currentUserId) {
            handleSearch(currentUserId);
          }
        }}
      >
        <Image className={style.searchIcon} src={searchIcon} alt="search" />
      </button>

      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        className={classNames(
          style.searchInput,
          style[searchInputThemeClassName]
        )}
        type="text"
      />

      <button
        className={classNames(style.searchDeleteButton, Poppins.className)}
        onClick={handleSb}
      >
        <Image
          className={style.searchDeleteIcon}
          src={searchDeleteIcon}
          alt="delete"
        />
      </button>
    </div>
  );
};
