"use client";

import { PageWrapper, Menu } from "@/components";

import style from "./page.module.css";

import background from "../../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, BASE_API_URL } from "@/constants";
import {
  IFullReview,
  IReview,
  IReviewComment,
  ReviewLikeAction,
} from "@/types";
import { useState, useCallback, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserContext, useAuthCheck } from "@/utils";
import "../../../../public/heart.svg";
import { Bounce, toast } from "react-toastify";
import { Avatar } from "antd";

export default function CurrentReviews() {
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<string>("");
  const [newReview, setNewReview] = useState<string>("");
  const [isReviewRed, setIsReviewRed] = useState<boolean>(false);
  const [review, setReview] = useState<IFullReview | null>(null);
  const [comments, setReviewComments] = useState<IReviewComment[]>([]);
  const [isComment, setIsComment] = useState<boolean>(false);

  const [likedData, setLikedData] = useState<{ [id: string]: boolean }>(() => {
    if (!comments) {
      return {};
    }

    const result: { [id: string]: boolean } = {};

    comments.forEach((item) => {
      result[item.review_comment_id] = item.is_liked ? item.is_liked : false;
    });

    return result;
  });

  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;

  const router = useRouter();

  useAuthCheck(router);

  const loadReview = useCallback(async () => {
    const reviewResponse = await fetch(`${API_URL}/review_by_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
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
  }, [params.id, accessToken, refreshToken]);

  const loadReviewComments = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    const reviewCommentsResponse = await fetch(`${API_URL}/review_comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify({
        review_id: params.id,
        user_id: currentUserId,
      }),
    });

    const reviewCommentsData: {
      success: boolean;
      message: string;
      comments: IReviewComment[];
    } = await reviewCommentsResponse.json();

    console.log("review data", reviewCommentsData);
    if (!reviewCommentsData.success && reviewCommentsData.message) {
      toast(reviewCommentsData.message, {
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
        type: "error",
      });

      return;
    }

    if (reviewCommentsData.success) {
      setReviewComments(reviewCommentsData.comments);

      const result: { [id: string]: boolean } = {};

      reviewCommentsData.comments.forEach((item) => {
        result[item.review_comment_id] = item.is_liked ? item.is_liked : false;
      });

      setLikedData({ ...result });
    }
  }, [currentUserId, params.id, accessToken, refreshToken]);

  useEffect(() => {
    loadReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadReviewComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

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
            LibAuthentication: accessToken || "",
            LibRefreshAuthentication: refreshToken || "",
          },
          body: JSON.stringify({
            review_id: params.id,
            user_id: currentUserId,
            comment: message,
          }),
        }
      );

      const sendCommentData: {
        success: boolean;
        message: string;
        newComment: IReviewComment;
      } = await sendCommentResponse.json();

      console.log("review data", sendCommentData);
      if (!sendCommentData.success && sendCommentData.message) {
        toast(sendCommentData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      if (sendCommentData.success) {
        setReviewComments((prev) => {
          return [...prev, sendCommentData.newComment];
        });
        setCurrentComment("");
        setIsComment(false);
      }

      setIsLoading(false);
    },
    [currentUserId, params.id, accessToken, refreshToken]
  );

  const handleAddComment = useCallback(() => {
    console.log("send>", currentComment);
    sendComment(currentComment);
  }, [currentComment, sendComment]);

  const changeReview = useCallback(
    async (text: string) => {
      const changeReviewResponse = await fetch(`${API_URL}/review/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          review_id: params.id,
          new_review: text,
        }),
      });

      const changeReviewData: { success: boolean; message: string } =
        await changeReviewResponse.json();

      console.log("review data", changeReviewData);
      if (!changeReviewData.success && changeReviewData.message) {
        toast(changeReviewData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      if (changeReviewData.success && review !== null) {
        setNewReview(text);
        setIsReviewRed(false);
        setReview((prevR) => (prevR ? { ...prevR, txt: text } : prevR));
        toast("Review updated, thank you!", {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "success",
        });
      } else {
        toast("Error with review change", {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
      }
    },
    [params.id, review, accessToken, refreshToken]
  );

  const doCommentAction = useCallback(
    async (state: ReviewLikeAction, commentId: number) => {
      if (!currentUserId) {
        return;
      }

      const doCommentActionResponse = await fetch(
        `${API_URL}/update_review_comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            LibAuthentication: accessToken || "",
            LibRefreshAuthentication: refreshToken || "",
          },
          body: JSON.stringify({
            review_comment_id: commentId,
            user_id: currentUserId,
            action: state,
          }),
        }
      );

      const sendCommentData: { success: boolean; message: string } =
        await doCommentActionResponse.json();

      console.log("review data", sendCommentData);

      if (!sendCommentData.success && sendCommentData.message) {
        toast(sendCommentData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
  
        return;
      }
  
      if (sendCommentData.success) {
        toast(sendCommentData.message, {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "success",
        });
        setLikedData((prev) => {
          return { ...prev, [commentId]: state === "add" ? true : false };
        });
      }

      if (!sendCommentData.success) {
        toast(sendCommentData.message, {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
      }

      setIsLoading(false);
    },
    [currentUserId, accessToken, refreshToken]
  );

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <div>
          <h1 className={classNames(style.pageTitleBook, Poppins.className)}>
            {review?.book_name}
          </h1>

          <h1 className={classNames(style.pageTitle, Poppins.className)}>
            <span style={{ fontWeight: "700" }}>{review?.user_name} </span>
            writes:
          </h1>
        </div>

        <div className={style.wrapper}>
          <div className={style.mainReview}>
            {review && !isReviewRed && (
              <p
                className={classNames(Poppins.className, style.mainReviewText)}
              >
                {review.txt}
              </p>
            )}

            {isReviewRed && (
              <textarea
                className={style.newReviewArea}
                value={newReview}
                onChange={(e) => {
                  setNewReview(e.target.value);
                }}
              />
            )}

            {review && (
              <p
                className={classNames(Poppins.className, style.mainReviewRate)}
              >
                {review.rate}
              </p>
            )}

            <div className={style.controls}>
              {review && (
                <p
                  className={classNames(
                    Poppins.className,
                    style.mainReviewDate
                  )}
                >
                  {review.date}
                </p>
              )}

              {review && currentUserId === review.user_id && !isReviewRed && (
                <button
                  onClick={() => {
                    setIsReviewRed(true);
                    setNewReview(review.txt);
                  }}
                  className={classNames(style.btn, style.spcBtn)}
                >
                  Change
                </button>
              )}

              {review && currentUserId === review.user_id && isReviewRed && (
                <button
                  onClick={() => {
                    setIsReviewRed(false);
                    setNewReview("");
                  }}
                  className={classNames(style.btn, style.spcBtn)}
                >
                  cancel
                </button>
              )}

              {review && isReviewRed && currentUserId === review.user_id && (
                <button
                  onClick={() => {
                    changeReview(newReview);
                  }}
                  className={classNames(style.btn, style.spcBtn)}
                >
                  send new
                </button>
              )}

              {/* <button>Like</button> */}
            </div>
          </div>

          {comments && (
            <div className={style.comments}>
              {comments.map((comment) => (
                <div key={comment.review_comment_id} className={style.comment}>
                  {comment.user_avatar && (
                    <div className={style.avatar}>
                      <Avatar
                        src={`${BASE_API_URL}/avatars/${comment.user_avatar}`}
                        alt={`${comment.user_id} image`}
                        size={40} // Adjust the size as needed
                      />
                    </div>
                  )}

                  <div className={style.commentContent}>
                    <p className={classNames(Poppins.className, style.text)}>
                      {comment.txt}
                    </p>

                    {currentUserId !== comment.user_id && (
                      <button
                        className={style.commentLike}
                        onClick={() => {
                          const action = likedData[comment.review_comment_id]
                            ? "remove"
                            : "add";

                          doCommentAction(action, comment.review_comment_id);
                        }}
                      >
                        <div
                          className={classNames(style.heart, {
                            [style.isLiked]:
                              likedData[comment.review_comment_id],
                          })}
                        ></div>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isComment && (
            <button
              onClick={() => {
                setIsComment(true);
              }}
              className={classNames(style.btn, style.btnRight)}
            >
              Comment
            </button>
          )}

          {isComment && (
            <div className={style.red}>
              <textarea
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                className={style.etxtarea}
              />

              <button onClick={handleAddComment} className={style.btn}>
                send comment
              </button>

              <button
                onClick={() => {
                  setCurrentComment("");
                  setIsComment(false);
                }}
                className={style.btn}
              >
                cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
