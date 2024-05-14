"use client";

import { PageWrapper, Menu, BookInfoSection, ReviewCard } from "@/components";
import Modal from "react-modal";

import style from "./page.module.css";

import background from "../../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/constants";
import { IBook, ICollection, IReview } from "@/types";
import { useParams } from "next/navigation";
import { WriteReviewButton } from "@/components/WriteReviewButton";
import ReviewForm from "@/components/ReviewForm/ReviewForm";

type filtersType = "reviews" | "collections" | "quotes";

const enabledFilters: filtersType[] = ["reviews", "collections", "quotes"];

export default function BookPage() {
  const [filter, setFilter] = useState<filtersType>("reviews");
  const [book, setBook] = useState<IBook | null>(null);
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const params = useParams<{ id: string }>();
  const [isReviewFormVisible, setIsReviewFormVisible] =
    useState<boolean>(false);

  const loadReviews = useCallback(async () => {
    const reviewResponse = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: params.id,
      }),
    });

    const reviewData: { success: boolean; reviews?: IReview[] } =
      await reviewResponse.json();

    console.log("REVIWS", reviewData.reviews);

    if (reviewData.success && reviewData.reviews) {
      setReviews(reviewData.reviews);
    }
  }, [params.id]);

  const loadBook = useCallback(async () => {
    const bookResposnse = await fetch(`${API_URL}/search/id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(`${params.id}`),
    });

    const bookData: IBook = await bookResposnse.json();

    console.log("BOOK", bookData);

    setBook(bookData);

    loadReviews();
  }, [loadReviews, params.id]);

  // const loadCollections = useCallback(async() => {
  //   const collectionsResponse = await fetch(`${API_URL}/bookcollection/${params.id}`);

  //   const collectionsData: ICollection[] = await collectionsResponse.json();

  //   setCollections(collectionsData);
  // }, [params.id]);

  // useEffect(() => {
  //   loadBook();
  //   loadCollections();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Modal
        isOpen={isReviewFormVisible}
        onRequestClose={() => {
          setIsReviewFormVisible(false);
        }}
        className={style.modal}
        overlayClassName={style.overlay}
      >
        <ReviewForm onSuccess={() => setIsReviewFormVisible(false)} />
      </Modal>

      <Menu />

      <div className={style.pageContent}>
        {book && <BookInfoSection {...book} />}

        <div className={style.tabsWrapper}>
          {enabledFilters.map((item) => (
            <div
              key={item}
              className={classNames(style.tab, {
                [style.selected]: filter === item,
              })}
              onClick={() => {
                if (filter !== item) {
                  setFilter(item);
                }
              }}
            >
              <p className={classNames(style.tabTitle, Poppins.className)}>
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className={style.mainContent}>
          <WriteReviewButton
            handleClick={() => setIsReviewFormVisible((state) => !state)}
          />

          {filter === "reviews" &&
            reviews &&
            reviews.map((item) => (
              <ReviewCard key={item.review_id} {...item} />
            ))}

          {/* {filter === "collections" &&
            books.map((item) => <BookCard key={item.book_id} {...item} />)} */}

          {filter === "quotes" &&
            [1, 2, 3].map((item) => (
              <div className={style.quote} key={item}>
                <h5 className={classNames(style.title, Poppins.className)}>
                  Tomas Li the {item}
                </h5>

                <p className={classNames(style.description, Poppins.className)}>
                  {item} &#34;A powerful story set in the Deep South, tackling
                  themes of racism and injustice through the eyes of a young
                  girl.&#34;
                </p>
              </div>
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}
