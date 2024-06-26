"use client";

import { FC, useCallback, useContext, useState } from "react";
import Image from "next/image";
import style from "./Search.module.css";

import searchIcon from "../../../public/search-glass.svg";
import searchDeleteIcon from "../../../public/search-delete.svg";
import { API_URL } from "@/constants";
import { ISearchData } from "@/types/SearchData";
import { UserContext } from "@/utils";
import { Poppins } from "@/fonts";
import classNames from "classnames";

export interface SearchProps {
  handleDateChange: (data: ISearchData) => void;
}

export const Search: FC<SearchProps> = ({ handleDateChange }) => {
  const [value, setValue] = useState<string>("");
  const { currentUserId } = useContext(UserContext)!;

  const handleSearch = useCallback(
    async (id: number) => {
      const booksResponse = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: value,
          user_id: id,
        }),
      });

      const searchData: ISearchData = await booksResponse.json();

      console.log("search data", searchData);

      // setBooks(booksData);
      handleDateChange(searchData);
    },
    [handleDateChange, value]
  );

  const handleSb = () => {
    setValue("");
  };

  return (
    <div className={style.search}>
       <button className={classNames(style.searchButton, Poppins.className)}
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
        className={style.searchInput}
        type="text"
      />

      
      <button className={classNames(style.searchDeleteButton, Poppins.className)} onClick={handleSb}>
      <Image className={style.searchDeleteIcon} src={searchDeleteIcon} alt="delete" />
      </button>
    </div>
  );
};
