"use client";

import {
  PageWrapper,
  BookCard,
  Menu,
  Search,
  CollectionCard,
  ReviewCard,
} from "@/components";

import style from "./page.module.css";

import background from "../../public/page-background-main.png";
import { API_URL, API_USER_ID, reviews } from "@/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IBook, ICollection } from "@/types";
import { useAuthCheck } from "@/utils";
import { useRouter } from "next/navigation";
import { ISearchData } from "@/types/SearchData";
import { FriendCard } from "@/components/FriendCard";

export default function Home() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [searchData, setSearchData] = useState<ISearchData>();

  const [currentUserId, setCurrentUserId] = useState<string | 1>(API_USER_ID);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window ? window.localStorage.getItem("user_id") : null;
      setCurrentUserId(item ? item : API_USER_ID);
    }
  }, []);

  const router = useRouter();

  useAuthCheck(router);

  const loadCollections = useCallback(async () => {
    const collectionsResponse = await fetch(`${API_URL}/all_user_collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
      }),
    });

    const collectionsData = await collectionsResponse.json();

    console.log("collections", collectionsData.collections);

    setCollections(collectionsData.collections);
  }, [currentUserId]);

  const loadBooks = useCallback(async () => {
    const booksResponse = await fetch(`${API_URL}/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
      }),
    });

    const booksData: IBook[] = await booksResponse.json();

    console.log("data", booksData);

    setBooks(booksData);

    await loadCollections();
  }, [currentUserId, loadCollections]);

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSearch: boolean = useMemo(() => {
    if (searchData && searchData.books.length > 0) {
      return true;
    }

    if (searchData && searchData.users.length > 0) {
      return true;
    }

    if (searchData && searchData.book_by_author.length > 0) {
      return true;
    }
    return false;
  }, [searchData]);

  const [fdata, setFdata] = useState<{ [id: string]: boolean }>(() => {
    if (!searchData) {
      return {};
    }

    const res: { [id: string]: boolean } = {};

    searchData.users.forEach((item) => {
      res[item.id] = item.is_friend;
    });

    return res;
  });

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <Search handleDateChange={(data) => setSearchData(data)} />

        <div className={style.mainContent}>
          {!isSearch &&
            collections.map((collection) => (
              <CollectionCard key={collection.id} {...collection} />
            ))}

          {!isSearch && <ReviewCard {...reviews[0]} />}

          {!isSearch &&
            books.map((item) => <BookCard key={item.book_id} {...item} />)}

          {isSearch &&
            searchData &&
            searchData.books.map((bb) => <BookCard key={bb.book_id} {...bb} />)}

          {isSearch &&
            searchData &&
            searchData.users.map((us) => {
              return (
                <FriendCard
                  key={us.id}
                  onSuccess={(id, status) => {
                    const copy = { ...fdata };
                    if (status === "add") {
                      copy[id] = true;
                      console.log("a", fdata);
                    } else if (status === "remove") {
                      copy[id] = false;
                      console.log("r", fdata);
                    }
                    setFdata(copy);
                  }}
                  isFriend={fdata[us.id]}
                  {...us}
                />
              );
            })}

          {isSearch &&
            searchData &&
            searchData.book_by_author.map((bb) => (
              <BookCard key={bb.book_id} {...bb} />
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}
