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
import { API_URL, reviews } from "@/constants";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IBook, ICollection } from "@/types";
import { UserContext, useAuthCheck } from "@/utils";
import { useRouter } from "next/navigation";
import { ISearchData } from "@/types/SearchData";
import { FriendCard } from "@/components/FriendCard";
import { Bounce, toast } from "react-toastify";
import { useTokenRefresh } from "@/utils/useRefreshToken";

export default function Home() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [searchData, setSearchData] = useState<ISearchData>();

  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;

  const router = useRouter();
  const refreshTokenHandler = useTokenRefresh();

  useAuthCheck(router);

  const loadCollections = useCallback(
    async (id: number) => {
      const collectionsResponse = await fetch(
        `${API_URL}/all_user_collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            LibAuthentication: accessToken || "",
            LibRefreshAuthentication: refreshToken || "",
          },
          body: JSON.stringify({
            user_id: id,
          }),
        }
      );

      const collectionsData = await collectionsResponse.json();

      if (!collectionsData.success) {
        if (collectionsData.message === "TOKEN_EXPIRED") {
          toast("expired session. refreshing tokens", {
            autoClose: 2000,
            type: "info",
          });

          return "REPEAT";
        }

        toast(collectionsData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
        return;
      }

      setCollections(collectionsData.collections);
    },
    [accessToken, refreshToken]
  );

  const loadBooks = useCallback(
    async (id: number) => {
      console.log("going to load with: ", accessToken);

      const booksResponse = await fetch(`${API_URL}/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: id,
        }),
      });

      const booksData = await booksResponse.json();

      console.log("api response:", booksData);

      if (!booksData.success && booksData.message) {
        if (booksData.message === "TOKEN_EXPIRED") {
          toast("expired session. refreshing tokens", {
            autoClose: 2000,
            type: "info",
          });

          return "REPEAT";
        }

        toast(booksData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      if (Array.isArray(booksData)) {
        setBooks(booksData);
      } else {
        toast("unexpected format of books", {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
      }

      if (currentUserId) {
        const state = await loadCollections(currentUserId);

        if (state === "REPEAT") {
          refreshTokenHandler(currentUserId, async () => {
            await loadCollections(currentUserId);
          });
        }
      }
    },
    [
      accessToken,
      refreshToken,
      currentUserId,
      loadCollections,
      refreshTokenHandler,
    ]
  );

  const loadBooksWithRefresh = useCallback(async () => {
    if (currentUserId) {
      const state = await loadBooks(currentUserId);

      if (state === "REPEAT") {
        refreshTokenHandler(currentUserId, async () => {
          await loadBooks(currentUserId);
        });
      }
    }
  }, [currentUserId, loadBooks, refreshTokenHandler]);

  useEffect(() => {
    loadBooksWithRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentUserId]);

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
