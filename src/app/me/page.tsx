"use client";

import {
  PageWrapper,
  BookCard,
  Menu,
  BookStatus,
  convertBookStatusToBd,
  ReviewCard,
  CollectionCard,
} from "@/components";
import { useCallback, useEffect, useState } from "react";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import { ProfileSection } from "@/components/ProfileSection";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, API_USER_ID, enabledFilters, filtersType } from "@/constants";
import { IBook, ICollection, IReview, IUser } from "@/types";
import { FriendCard } from "@/components/FriendCard";
import { useAuthCheck } from "@/utils";
import { getMonthName } from "@/utils";
import { useRouter } from "next/navigation";

interface Me {
  id: number;
  name: string;
  avatarUrl: string;
  info: string;
}

export default function Me() {
  const [filter, setFilter] = useState<filtersType>("read");
  const [books, setBooks] = useState<IBook[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [me, setMe] = useState<Me>({
    id: 1,
    info: "",
    name: "User",
    avatarUrl: "",
  });
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<string | 1>(API_USER_ID);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window ? window.localStorage.getItem("user_id") : null;
      setCurrentUserId(item ? item : API_USER_ID);
    }
  }, []);

  useAuthCheck(router);

  const loadMe = useCallback(async () => {
    const meResponse = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(`${currentUserId}`),
    });

    const meData: Me = await meResponse.json();

    console.log("me data", meData);

    setMe(meData);
  }, []);

  const changeInfoSuccessHandler = (newInfo: string) => {
    setMe((me) => {
      return { ...me, info: newInfo };
    });
  };

  // const loadBooks = useCallback(async () => {
  //   const booksResponse = await fetch(`${API_URL}/get_user_books`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(`${currentUserId}`),
  //   });

  //   const booksData: IBook[] = await booksResponse.json();

  //   console.log("data", booksData);

  //   setBooks(booksData);
  // }, []);

  const loadBooksByStatus = useCallback(
    async (status: BookStatus) => {
      const booksResponse = await fetch(`${API_URL}/get_user_books_by_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUserId,
          status: convertBookStatusToBd(status),
        }),
      });

      const booksData: IBook[] = await booksResponse.json();

      console.log("data", booksData);

      setBooks(booksData);
    },
    [currentUserId]
  );

  const loadUserReviews = useCallback(async () => {
    const userReviewsResponse = await fetch(`${API_URL}/reviews_owner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
      }),
    });

    const reviewData: { success: boolean; reviews: IReview[] } =
      await userReviewsResponse.json();

    console.log("review data", reviewData);

    if (reviewData.success) {
      setReviews(reviewData.reviews);
    }
  }, [currentUserId]);

  const loadFriendsData = useCallback(async () => {
    const friendsResponse = await fetch(`${API_URL}/friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
      }),
    });

    const friendsData: { success: boolean; friendsList?: IUser[] } =
      await friendsResponse.json();

    console.log("Friends", friendsData.friendsList);

    if (friendsData.success && friendsData.friendsList) {
      const filteredFriends = friendsData.friendsList.filter(
        (friend) => friend.id !== currentUserId
      );

      setFriends(filteredFriends);
    }
  }, [currentUserId]);

  const loadCollectionsData = useCallback(async () => {
    //change USER id to user RN
    const collectionsResponse = await fetch(`${API_URL}/all_user_collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
      }),
    });

    const collectionsData: { collections: ICollection[] } =
      await collectionsResponse.json();

    const userColls = collectionsData.collections.filter(
      (collection) => collection.author === me.name
    );

    console.log("collections", userColls);

    setCollections(userColls);
  }, [me.name, currentUserId]);

  const loadReadBooks = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await loadBooksByStatus("read");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, loadBooksByStatus]);

  const loadCompleteBooks = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await loadBooksByStatus("complete");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, loadBooksByStatus]);

  const loadReadingBooks = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await loadBooksByStatus("reading");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, loadBooksByStatus]);

  const loadReviews = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await loadUserReviews();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, loadUserReviews]);

  const loadFriends = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await loadFriendsData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, loadFriendsData]);

  const loadCollectios = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await loadCollectionsData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, loadCollectionsData]);

  const loadCurrentBooks = useCallback(
    (filter: filtersType) => {
      if (filter === "read") {
        loadReadBooks();
        return;
      }

      if (filter === "completed") {
        loadCompleteBooks();
        return;
      }

      if (filter === "reading") {
        loadReadingBooks();
        return;
      }

      if (filter === "reviews") {
        loadReviews();
        return;
      }

      if (filter === "collections") {
        loadCollectios();
        return;
      }

      if (filter === "friends") {
        loadFriends();
        return;
      }
    },
    [
      loadCompleteBooks,
      loadReadBooks,
      loadReadingBooks,
      loadReviews,
      loadCollectios,
      loadFriends,
    ]
  );

  useEffect(() => {
    // loadBooks();
    loadCurrentBooks(filter);
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let currentMonth = 0;

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <ProfileSection {...me} onChangeInfo={changeInfoSuccessHandler} isMe />

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
                  loadCurrentBooks(item);
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
          {filter === "read" &&
            books.map((item) => <BookCard key={item.book_id} {...item} />)}

          {filter === "reading" &&
            books.map((item) => <BookCard key={item.book_id} {...item} />)}

          {filter === "completed" &&
            books
              .sort((a, b) => {
                if (a.date && b.date) {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);

                  return dateA.getTime() - dateB.getTime();
                }

                return 0;
              })
              .map((book) => {
                if (!book.date) {
                  return;
                }
                const month = +book.date.substr(5, 2); // Извлечение месяца из поля date (предполагается формат 'year-month-day')

                // Если текущий месяц отличается от полученного месяца, выводим название месяца
                if (currentMonth !== month) {
                  currentMonth = month;
                  return (
                    <div key={month}>
                      <h1 style={{ fontSize: "30px" }}>
                        {getMonthName(month)}
                      </h1>
                      <BookCard key={book.book_id} {...book} />
                    </div>
                  );
                }

                return <BookCard key={book.book_id} {...book} />;
              })}

          {filter === "reviews" &&
            reviews.map((review) => (
              <ReviewCard key={review.review_id} {...review} />
            ))}

          {filter === "collections" &&
            collections.map((collection) => (
              <CollectionCard key={collection.id} {...collection} />
            ))}

          {filter === "friends" &&
            friends.map((friend) => (
              <FriendCard
                isFriend
                key={friend.id + friend.name}
                onSuccess={(id) =>
                  setFriends((friends) =>
                    friends.filter((friend) => friend.id !== id)
                  )
                }
                {...friend}
              />
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}
