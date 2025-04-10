"use client";

import { FC, useCallback, useContext, useMemo, useState } from "react";
import style from "./BookCard.module.css";
import { IBook } from "@/types";
import { Poppins } from "@/fonts";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import {
  UserContext,
  generateRandomColorLight,
  generateRandomColorDark,
  ThemeContext,
} from "@/utils";
import { API_URL, BASE_API_URL } from "@/constants";
import { useAuthCheck } from "@/utils";

export type BookStatus = "read" | "reading" | "complete";
export type BookStatusDB = "Прочитано" | "Буду читать" | "Читаю сейчас";

import { Image } from "antd";
import { toast, Bounce } from "react-toastify";

export interface BookCardProps extends IBook {
  backgroundColor?: string;
}

export const convertBookStatusToApp = (
  status: BookStatusDB | string
): BookStatus | null => {
  if (status === "Буду читать") return "read";

  if (status === "Читаю сейчас") return "reading";

  if (status === "Прочитано") return "complete";

  return null;
};

export const convertBookStatusToBd = (status: BookStatus): BookStatusDB => {
  if (status === "read") return "Буду читать";

  if (status === "reading") return "Читаю сейчас";

  if (status === "complete") return "Прочитано";

  return "Буду читать";
};

export const BookCard: FC<BookCardProps> = ({
  book_id,
  name,
  author,
  annotation,
  backgroundColor = "",
  path = "",
  status = "",
}) => {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BookStatus | null>(
    convertBookStatusToApp(status)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBookClick = useCallback(() => {
    router.replace(`/book/${book_id}`);
  }, [router, book_id]);

  const { currentTheme } = useContext(ThemeContext);

  const bgColor: string = useMemo(() => {
    return currentTheme === "light"
      ? generateRandomColorLight()
      : generateRandomColorDark();
  }, [currentTheme]);

  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;

  useAuthCheck(router);

  const changeStatus = useCallback(
    async (book_id: number, status: BookStatus, id: number) => {
      const bookStatusResponse = await fetch(`${API_URL}/update_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: id,
          book_id,
          status: convertBookStatusToBd(status),
        }),
      });

      const bookStatusData: { success: boolean; message: string } =
        await bookStatusResponse.json();

      console.log("new status", status);

      if (!bookStatusData.success && bookStatusData.message) {
        toast(bookStatusData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      setCurrentStatus(status);
    },
    [accessToken, refreshToken]
  );

  const handleBookComplete = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    setIsLoading(true);
    try {
      await changeStatus(book_id, "complete", currentUserId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [book_id, changeStatus, currentUserId]);

  const handleBookWillRead = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    setIsLoading(true);
    try {
      await changeStatus(book_id, "read", currentUserId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [book_id, changeStatus, currentUserId]);

  const handleBookReading = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    setIsLoading(true);
    try {
      await changeStatus(book_id, "reading", currentUserId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [book_id, changeStatus, currentUserId]);

  return (
    <div
      className={style.card}
      style={{ backgroundColor: backgroundColor ? backgroundColor : bgColor }}
      onClick={handleBookClick}
    >
      <div className={style.cardHeader}>
        <div className={style.cardHeaderContent}>
          <h5 className={classNames(style.title, Poppins.className)}>{name}</h5>

          <p className={classNames(style.subtitle, Poppins.className)}>
            {author}
          </p>
        </div>

        {path ? (
          <div className={style.imageWrapper}>
            <Image src={`${BASE_API_URL}/${path}`} alt={`${name} image`} />
          </div>
        ) : (
          <div className={style.tmpIcon}></div>
        )}
      </div>

      <p className={classNames(style.description, Poppins.className)}>
        {annotation}
      </p>

      <div className={style.actions}>
        {currentStatus !== "read" && (
          <button
            className={classNames(style.action, style.read)}
            onClick={(event) => {
              handleBookWillRead();
              event.stopPropagation();
            }}
          >
            To read
          </button>
        )}

        {currentStatus !== "reading" && (
          <button
            className={classNames(style.action, style.reading)}
            onClick={(event) => {
              handleBookReading();
              event.stopPropagation();
            }}
          >
            Reading
          </button>
        )}

        {currentStatus !== "complete" && (
          <button
            className={classNames(style.action, style.complete)}
            onClick={(event) => {
              handleBookComplete();
              event.stopPropagation();
            }}
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
};
