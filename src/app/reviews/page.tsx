"use client";

import {
  PageWrapper,
  Menu,
  ReviewCard,
  BookReviewStartCard,
} from "@/components";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL } from "@/constants";
import { IReview } from "@/types";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/utils";

export default function Reviews() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const router = useRouter();

  useAuthCheck(router);

  const loadAllReviews = useCallback(async () => {
    const userReviewsResponse = await fetch(`${API_URL}/all_reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    });

    const reviewData: { success: boolean; reviews: IReview[] } =
      await userReviewsResponse.json();

    console.log("review data", reviewData);

    if (reviewData.success) {
      setReviews(reviewData.reviews);
    }
  }, []);

  useEffect(() => {
    loadAllReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <h1 className={classNames(style.pageTitle, Poppins.className)}>
          Book Reviews
        </h1>

        <div className={style.mainContent}>
          <BookReviewStartCard />

          {reviews.map((item) => (
            <ReviewCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
