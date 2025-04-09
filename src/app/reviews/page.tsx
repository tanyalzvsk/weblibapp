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
import { useState, useCallback, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck, UserContext } from "@/utils";
import { toast, Bounce } from "react-toastify";

export default function Reviews() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const router = useRouter();

  const { accessToken, refreshToken } = useContext(UserContext)!;

  useAuthCheck(router);

  const loadAllReviews = useCallback(async () => {
    const userReviewsResponse = await fetch(`${API_URL}/all_reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication:  accessToken || '',
        LibRefreshAuthentication: refreshToken || '',
      },
      body: JSON.stringify(""),
    });

    const reviewData: { success: boolean; message: string; reviews: IReview[] } =
      await userReviewsResponse.json();

    console.log("review data", reviewData);
    if (!reviewData.success && reviewData.message) {
      toast(reviewData.message, {
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
        type: "error",
      });

      return;
    }
    if (reviewData.success) {
      setReviews(reviewData.reviews);
    }
  }, [accessToken, refreshToken]);

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
