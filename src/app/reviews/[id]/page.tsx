"use client";

import { PageWrapper, Menu } from "@/components";

import style from "./page.module.css";

import background from "../../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, BASE_API_URL } from "@/constants";
import { IFullReview, IReview, IReviewComment } from "@/types";
import { useState, useCallback, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserContext, useAuthCheck } from "@/utils";
import Image from "next/image";

export default function CurrentReviews() {
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<string>("");
  const [review, setReview] = useState<IFullReview | null>(null);
  const [comments, setReviewComments] = useState<IReviewComment[]>([]);

  const { currentUserId } = useContext(UserContext)!;

  const router = useRouter();

  useAuthCheck(router);

  const loadReview = useCallback(async () => {
    const reviewResponse = await fetch(`${API_URL}/review_by_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review_id: params.id,
      }),
    });

    const reviewData: { success: boolean; review: IFullReview } =
      await reviewResponse.json();

    console.log("review data", reviewData);

    if (reviewData.success) {
      setReview(reviewData.review);
    }
  }, [params.id]);

  const loadReviewComments = useCallback(async () => {
    const reviewCommentsResponse = await fetch(`${API_URL}/review_comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review_id: params.id,
      }),
    });

    const reviewCommentsData: { success: boolean; comments: IReviewComment[] } =
      await reviewCommentsResponse.json();

    console.log("review data", reviewCommentsData);

    if (reviewCommentsData.success) {
      setReviewComments(reviewCommentsData.comments);
    }
  }, [params.id]);

  useEffect(() => {
    loadReview();
    loadReviewComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendComment = useCallback(
    async (message: string) => {
      console.log("s", message, currentUserId);
      if (!currentUserId) {
        return;
      }

      setIsLoading(true);

      const sendCommentResponse = await fetch(
        `${API_URL}/write_review_comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_id: params.id,
            user_id: currentUserId,
            comment: message,
          }),
        }
      );

      const sendCommentData: { success: boolean; newComment: IReviewComment } =
        await sendCommentResponse.json();

      console.log("review data", sendCommentData);

      if (sendCommentData.success) {
        setReviewComments((prev) => {
          return [...prev, sendCommentData.newComment];
        });
        setCurrentComment("");
      }

      setIsLoading(false);
    },
    [currentUserId, params.id]
  );

  const handleAddComment = useCallback(() => {
    console.log("send>", currentComment);
    sendComment(currentComment);
  }, [currentComment, sendComment]);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <h1 className={classNames(style.pageTitle, Poppins.className)}>
          Book Review
        </h1>

        {/* //оригинальный отзыв */}
        <div>
          {review && <p>{review.txt}</p>}
          {review && <p>{review.date}</p>}
          {/* //оценка */}
          {review && <p>{review.rate}</p>}
        </div>

        {comments && (
          <div className={style.comments}>
            {comments.map((comment) => (
              <div key={comment.review_comment_id}>
                {comment.user_avatar && (
                  <div className={style.avatar}>
                    <Image
                      src={`${BASE_API_URL}/avatars/${comment.user_avatar}`}
                      alt={`${comment.user_id} image`}
                      fill
                    />
                  </div>
                )}
                <p>{comment.txt}</p>
                <p>{comment.date}</p>
              </div>
            ))}
          </div>
        )}

        <div>
          <h2>Add a comment</h2>

          <textarea
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
          />

          <button onClick={handleAddComment}>write</button>
        </div>
      </div>
    </PageWrapper>
  );
}
