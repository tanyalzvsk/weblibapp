"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import style from "./Search.module.css";

import searchIcon from "../../../public/search-glass.svg";
import { API_URL, API_USER_ID } from "@/constants";
import { ISearchData } from "@/types/SearchData";

export interface SearchProps {
  handleDateChange: (data: ISearchData) => void;
}

export const Search: FC<SearchProps> = ({ handleDateChange }) => {
  const [value, setValue] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | 1>(API_USER_ID);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window ? window.localStorage.getItem("user_id") : null;
      setCurrentUserId(item ? item : API_USER_ID);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    const booksResponse = await fetch(`${API_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: value,
        user_id: currentUserId,
      }),
    });

    const searchData: ISearchData = await booksResponse.json();

    console.log("search data", searchData);

    // setBooks(booksData);
    handleDateChange(searchData);
  }, [handleDateChange, value, currentUserId]);

  const handleSb = () => {
    setValue("");
  };

  return (
    <div className={style.search}>
      <Image className={style.searchIcon} src={searchIcon} alt="search" />

      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        className={style.searchInput}
        type="text"
      />

      <button onClick={handleSearch}>поиск</button>
      <button onClick={handleSb}>сбросить</button>
    </div>
  );
};
