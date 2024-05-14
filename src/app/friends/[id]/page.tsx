"use client";

import {
  PageWrapper,
  Menu,
  BookCard,
  CollectionCard,
  ReviewCard,
  BookStatus,
  convertBookStatusToBd,
} from "@/components";

import style from "./page.module.css";

import background from "../../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { useCallback, useEffect, useState } from "react";
import { API_URL, API_USER_ID, enabledFilters, filtersType } from "@/constants";
import { IUser, IBook, ICollection, IReview } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { ProfileSection } from "@/components/ProfileSection";
import { FriendCard } from "@/components/FriendCard";
import { useAuthCheck } from "@/utils";
import { getMonthName } from "@/utils";

export default function CollectionPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<filtersType>("read");
  const [user, setUserFriend] = useState<IUser | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<string | 1>(API_USER_ID);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window ? window.localStorage.getItem("user_id") : null;
      setCurrentUserId(item ? item : API_USER_ID);
    }
  }, []);

  useAuthCheck(router);

  const loadUserData = useCallback(async () => {
    const userResponse = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(`${params.id}`),
    });

    const userData: IUser = await userResponse.json();

    console.log("user", userData);

    setUserFriend(userData);
  }, [params.id]);

  const loadIsFriendData = useCallback(async () => {
    const isFriendResponse = await fetch(`${API_URL}/is_friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
        friend_id: params.id,
      }),
    });

    const isFriendData: { success: boolean; is_friend: boolean } =
      await isFriendResponse.json();

    console.log("is friend", isFriendData.success);

    if (isFriendData.success) {
      setIsFriend(isFriendData.is_friend);
    }
  }, [params.id, currentUserId]);

  // const loadBooks = useCallback(async () => {
  //   const booksResponse = await fetch(`${API_URL}/get_user_books`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(`${params.id}`),
  //   });

  //   const booksData: IBook[] = await booksResponse.json();

  //   console.log("data", booksData);

  //   setBooks(booksData);
  // }, [params.id]);

  const addFriendReq = useCallback(
    async (friend_id: number) => {
      const addFriendRes = await fetch(`${API_URL}/add_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id,
        }),
      });

      const friendsData: { success: boolean } = await addFriendRes.json();

      if (friendsData.success) {
        setIsFriend(true);
      }

      console.log("Add Friend? ", friendsData.success);
    },
    [currentUserId]
  );

  const removeFriendReq = useCallback(
    async (friend_id: number) => {
      const removeFriendRes = await fetch(`${API_URL}/remove_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id,
        }),
      });

      const friendsData: { success: boolean } = await removeFriendRes.json();

      if (friendsData.success) {
        setIsFriend(false);
      }

      console.log("remove Friend? ", friendsData.success);
    },
    [currentUserId]
  );

  const addFriend = useCallback(
    async (friend_id: number) => {
      setIsLoading(true);

      try {
        await addFriendReq(friend_id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [addFriendReq]
  );

  const deleteFriend = useCallback(
    async (friend_id: number) => {
      setIsLoading(true);

      try {
        await removeFriendReq(friend_id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [removeFriendReq]
  );

  const loadBooksByStatus = useCallback(
    async (status: BookStatus) => {
      const booksResponse = await fetch(`${API_URL}/get_user_books_by_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: params.id,
          status: convertBookStatusToBd(status),
        }),
      });

      const booksData: IBook[] = await booksResponse.json();

      console.log("data", booksData);

      setBooks(booksData);
    },
    [params.id]
  );

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

  const loadUserReviews = useCallback(async () => {
    const userReviewsResponse = await fetch(`${API_URL}/reviews_owner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: params.id,
      }),
    });

    const reviewData: { success: boolean; reviews: IReview[] } =
      await userReviewsResponse.json();

    console.log("review data", reviewData);

    if (reviewData.success) {
      setReviews(reviewData.reviews);
    }
  }, [params.id]);

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

  const loadFriendsData = useCallback(async () => {
    const friendsResponse = await fetch(`${API_URL}/friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: params.id,
      }),
    });

    const friendsData: { success: boolean; friendsList?: IUser[] } =
      await friendsResponse.json();

    console.log("Friends", friendsData.friendsList);

    if (friendsData.success && friendsData.friendsList) {
      setFriends(friendsData.friendsList);
    }
  }, [params.id]);

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

  const loadCollectionsData = useCallback(async () => {
    //change USER id to user RN
    const collectionsResponse = await fetch(`${API_URL}/all_user_collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: params.id,
      }),
    });

    const collectionsData: { collections: ICollection[] } =
      await collectionsResponse.json();

    const userColls = collectionsData.collections.filter(
      (collection) => collection.author === user?.name
    );

    console.log("collections", userColls);

    setCollections(userColls);
  }, [params.id, user?.name]);

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
    loadUserData();
    loadCurrentBooks(filter);
    loadIsFriendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let currentMonth = 0;

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <ProfileSection
          id={user ? user.id : 1}
          name={user ? user.name : "loading data"}
          avatarUrl=""
          isFriend={isFriend}
          onAddFriend={() => {
            if (user) {
              addFriend(user.id);
            }
          }}
          onRemoveFriend={() => {
            if (user) {
              deleteFriend(user.id);
            }
          }}
        />

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
                isMe={friend.id == currentUserId}
                key={friend.id + friend.name}
                isImmutable
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
