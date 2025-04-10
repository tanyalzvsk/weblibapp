import { useCallback, useContext, useState, useMemo, useEffect } from "react";
import style from "./ReviewForm.module.css";
import { BookRate } from "../BookRate";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import {
  Resolver,
  ResolverError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { API_URL } from "@/constants";
import { Bounce, toast } from "react-toastify";
import { UserContext, ThemeContext } from "@/utils";

export type Rating = 1 | 2 | 3 | 4 | 5;

type ReviewFormProps = {
  onSuccess?: () => void;
  bookId: number;
  userId: null | number;
};

type ReviewFormValues = {
  review: string;
  reviewTitle: string;
};

const customRes: Resolver<ReviewFormValues> = async (values) => {
  const result: ResolverError<ReviewFormValues> = { errors: {}, values };

  if (!values.review) {
    result.errors.review = {
      type: "required",
      message: "Review is required",
    };
  }

  if (!values.reviewTitle) {
    result.errors.reviewTitle = {
      type: "required",
      message: "Review title is required",
    };
  }

  return result;
};

const ReviewForm: React.FC<ReviewFormProps> = ({ onSuccess, bookId, userId }) => {
  const { currentTheme } = useContext(ThemeContext);
  const { handleSubmit, register, formState } = useForm<ReviewFormValues>({
    resolver: customRes,
  });

  const [title, setTitle] = useState("");
  const [rate, setRate] = useState<Rating | number>(1);
  const [text, setText] = useState("");

  const { accessToken, refreshToken } = useContext(UserContext)!;

  const handleFormSubmit: SubmitHandler<ReviewFormValues> = useCallback(
    async ({ review, reviewTitle }) => {
      console.log("here");

      if (!formState.isValid) {
        toast("Form is invalid! Check the data", {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "warning",
        });
        return;
      }

      const response = await fetch(`${API_URL}/review/write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          book_id: bookId,
          review,
          rate,
          // reviewTitle,
          user_id: userId,
        }),
      });

      const data: {
        success: boolean;
        message?: string;
      } = await response.json();

      console.log("me data", data);

      if (data.success) {
        toast("Review submitted! Thank you!", {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "success",
        });

        if (!data.success && data.message) {
          toast(data.message, {
            autoClose: 2000,
            transition: Bounce,
            closeOnClick: true,
            type: "error",
          });

          return;
        }

        if (onSuccess) {
          onSuccess();
        }
      }
    },
    [
      formState.isValid,
      accessToken,
      refreshToken,
      bookId,
      rate,
      userId,
      onSuccess,
    ]
  );

  const reviewThemeClassName = useMemo(() => {
    return "review-" + currentTheme;
  }, [currentTheme]);
  const titleThemeClassName = useMemo(() => {
    return "formTitle-" + currentTheme;
  }, [currentTheme]);

  return (
    <div className={classNames(style.review, style[reviewThemeClassName])}>
      <div
        className={classNames(
          style.formTitle,
          style.titleOfForm,
          style[titleThemeClassName]
        )}
      >
        <h2 className={classNames(style.formHeaders, Poppins.className)}>
          Your review
        </h2>
      </div>
      <form className={style.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <div className={style.formInfo}>
          <div className={style.reviewInfo}>
            <label className={style.reviewTitle} htmlFor="title">
              <h2 className={classNames(style.formHeaders, Poppins.className)}>
                Review&#39;s title
              </h2>

              <input
                {...register("reviewTitle")}
                className={style.titleInput}
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <div className={style.reviewTitle}>
              <h2 className={classNames(style.formHeaders, Poppins.className)}>
                Your rate
              </h2>

              <BookRate
                onRateChange={(rate: number) => {
                  setRate(rate);
                }}
              />
            </div>
          </div>
          <label htmlFor="text" className={style.reviewTitle}>
            <h2 className={classNames(style.formHeaders, Poppins.className)}>
              Review&#39;s text
            </h2>

            <textarea
              {...register("review")}
              className={style.reviewInput}
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          className={classNames(style.reviewPostButton, Poppins.className)}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
