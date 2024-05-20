"use client";

import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import style from "./BookCard.module.css";
import { IBook } from "@/types";
import { Poppins } from "@/fonts";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { UserContext, generateRandomColor } from "@/utils";
import Image from "next/image";
import { API_URL, API_USER_ID, BASE_API_URL } from "@/constants";
import { useAuthCheck } from "@/utils";

export type BookStatus = "to read" | "reading" | "complete";
export type BookStatusDB = "Прочитано" | "Буду читать" | "Читаю сейчас";

export interface BookCardProps extends IBook {
  backgroundColor?: string;
}

export const convertBookStatusToApp = (
  status: BookStatusDB | string
): BookStatus | null => {
  if (status === "Буду читать") return "to read";

  if (status === "Читаю сейчас") return "reading";

  if (status === "Прочитано") return "complete";

  return null;
};

export const convertBookStatusToBd = (status: BookStatus): BookStatusDB => {
  if (status === "to read") return "Буду читать";

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

  const bgColor: string = useMemo(() => {
    return generateRandomColor();
  }, []);

  const { currentUserId } = useContext(UserContext)!;

  useAuthCheck(router);

  const changeStatus = useCallback(
    async (book_id: number, status: BookStatus, id: number) => {
      const bookStatusResponse = await fetch(`${API_URL}/update_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id,
          book_id,
          status: convertBookStatusToBd(status),
        }),
      });

      const bookStatusData: { success: boolean } =
        await bookStatusResponse.json();

      console.log("new status", status);

      if (bookStatusData.success) {
        setCurrentStatus(status);
      }
    },
    []
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
      await changeStatus(book_id, "to read", currentUserId);
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
            <Image src={`${BASE_API_URL}/${path}`} alt={`${name} image`} fill />
          </div>
        ) : (
          <div className={style.tmpIcon}></div>
        )}
      </div>

      <p className={classNames(style.description, Poppins.className)}>
        {annotation}
      </p>

      <div className={style.actions}>
        {currentStatus !== "to read" && (
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
