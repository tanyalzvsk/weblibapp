"use client";

import { FC, useCallback } from "react";
import style from "./CollectionCard.module.css";
import { Poppins } from "@/fonts";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { ICollection } from "@/types";
import Image from "next/image";
import { BASE_API_URL } from "@/constants";

export interface CollectionCardProps extends ICollection {
  backgroundColor?: string;
}

export const CollectionCard: FC<CollectionCardProps> = ({
  id,
  title,
  author,
  books,
}) => {
  const router = useRouter();

  console.log("books", books);

  const handleBookClick = useCallback(() => {
    router.replace(`/collections/${id}`);
  }, [router, id]);

  return (
    <div className={style.card} onClick={handleBookClick}>
      <div className={style.cardInfo}>
        <h5 className={classNames(style.bookTitle, Poppins.className)}>
          {title}
        </h5>

        <p className={classNames(style.bookAuthor, Poppins.className)}>
          {author}
        </p>
      </div>

      <div className={style.booksContainer}>
        {books.map((item) =>
          item.path ? (
            <div key={item.book_id} className={style.imageWrapper}>
              <Image
                src={`${BASE_API_URL}/${item.path}`}
                alt={`${item.name} image`}
                fill
              />
            </div>
          ) : (
            <div key={item.book_id} className={style.block}></div>
          )
        )}
      </div>
    </div>
  );
};
