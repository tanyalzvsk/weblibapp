"use client";

import { PageWrapper, Menu, BookCard } from "@/components";

import style from "./page.module.css";

import background from "../../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/constants";
import { ICollection } from "@/types";
import { useParams } from "next/navigation";

export default function CollectionPage() {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [collection, setCollection] = useState<ICollection | null>(null);
  const params = useParams<{ id: string }>();

  const loadCollection = useCallback(async () => {
    const collectionResponse = await fetch(`${API_URL}/collection/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(`${params.id}`),
    });

    const collectionData: ICollection = await collectionResponse.json();

    console.log("collection", collectionData);

    setCollection(collectionData);
  }, [params.id]);

  useEffect(() => {
    loadCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <div className={style.pageHeader}>
          <button
            className={style.likeButton}
            onClick={() => {
              setIsLiked((status) => !status);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="26"
              viewBox="0 0 28 26"
            >
              <path
                d="M20.3662 0C17.6507 0 15.2369 1.65598 13.8792 4.13996C12.6723 1.65598 10.2585 0 7.39217 0C3.31893 0 0 3.64316 0 8.11432C0 18.2158 11.3145 25.8333 13.8792 25.8333C16.4438 25.8333 27.7584 17.3878 27.7584 8.11432C27.7584 3.64316 24.4394 0 20.3662 0Z"
                fill="#2B1313"
                fillOpacity={isLiked ? "0.9" : "0.3"}
              />
            </svg>
          </button>

          {collection && (
            <h1 className={classNames(style.pageTitle, Poppins.className)}>
              {collection.title} Collection
            </h1>
          )}
        </div>

        <div className={style.mainContent}>
          {collection &&
            collection.books.map((item) => (
              <BookCard key={item.book_id} {...item} />
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}
