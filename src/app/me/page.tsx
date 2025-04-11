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
import { useCallback, useContext, useEffect, useState } from "react";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import { ProfileSection } from "@/components/ProfileSection";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, filtersType } from "@/constants";
import { IBook, ICollection, IReview, IUser } from "@/types";
import { FriendCard } from "@/components/FriendCard";
import { UserContext, useAuthCheck } from "@/utils";
import { getMonthName } from "@/utils";
import { useRouter } from "next/navigation";

import { Tabs, Flex } from "antd";
import { Bounce, toast } from "react-toastify";
import { useTokenRefresh } from "@/utils/useRefreshToken";

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
  const { accessToken, refreshToken } = useContext(UserContext)!;
  const refreshTokenHandler = useTokenRefresh();

  const [me, setMe] = useState<Me>({
    id: 1,
    info: "",
    name: "User",
    avatarUrl: "",
  });
  const router = useRouter();
  const { currentUserId } = useContext(UserContext)!;

  useAuthCheck(router);

  const loadMe = useCallback(
    async (id: number) => {
      console.log("ud of user: ", id);

      const meResponse = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify(`${id}`),
      });

      const meData: Me | { message: string; success: boolean } =
        await meResponse.json();

      console.log("me data", meData);

      if ("message" in meData) {
        if (meData.message === "TOKEN_EXPIRED") {
          toast("expired session. refreshing tokens", {
            autoClose: 2000,
            type: "info",
          });

          return "REPEAT";
        }

        toast(meData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
        return;
      }
      setMe(meData);
    },
    [accessToken, refreshToken]
  );

  const changeInfoSuccessHandler = (newInfo: string) => {
    setMe((me) => {
      return { ...me, info: newInfo };
    });
  };

  const loadBooksByStatus = useCallback(
    async (status: BookStatus, id: number) => {
      const booksResponse = await fetch(`${API_URL}/get_user_books_by_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: id,
          status: convertBookStatusToBd(status),
        }),
      });

      const booksData: IBook[] | { message: string; success: boolean } =
        await booksResponse.json();

      if ("message" in booksData) {
        if (booksData.message === "TOKEN_EXPIRED") {
          toast("expired session. refreshing tokens", {
            autoClose: 2000,
            type: "info",
          });

          return "REPEAT";
        }

        toast(booksData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }
      console.log("data", booksData);

      setBooks(booksData);
    },
    [accessToken, refreshToken]
  );

  const loadUserReviews = useCallback(
    async (id: number) => {
      const userReviewsResponse = await fetch(`${API_URL}/reviews_owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: id,
        }),
      });

      const reviewData: {
        success: boolean;
        message?: string;
        reviews: IReview[];
      } = await userReviewsResponse.json();

      console.log("review data", reviewData);

      if (!reviewData.success) {
        if (reviewData.message === "TOKEN_EXPIRED") {
          toast("expired session. refreshing tokens", {
            autoClose: 2000,
            type: "info",
          });

          return "REPEAT";
        }

        toast(reviewData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
        return;
      }
      setReviews(reviewData.reviews);
    },
    [accessToken, refreshToken]
  );

  const loadFriendsData = useCallback(
    async (id: number) => {
      const friendsResponse = await fetch(`${API_URL}/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: id,
        }),
      });

      const friendsData: {
        success: boolean;
        message: string;
        friendsList?: IUser[];
      } = await friendsResponse.json();

      if (!friendsData.success) {
        if (friendsData.message === "TOKEN_EXPIRED") {
          toast("expired session. refreshing tokens", {
            autoClose: 2000,
            type: "info",
          });

          return "REPEAT";
        }

        toast(friendsData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
        return;
      }

      console.log("Friends", friendsData.friendsList);

      if (friendsData.success && friendsData.friendsList) {
        const filteredFriends = friendsData.friendsList.filter(
          (friend) => friend.id !== id
        );

        setFriends(filteredFriends);
      }
    },
    [accessToken, refreshToken]
  );
  const loadMeWithRefresh = useCallback(async () => {
    if (currentUserId) {
      const state = await loadMe(currentUserId);

      if (state === "REPEAT") {
        refreshTokenHandler(currentUserId, async () => {
          await loadMe(currentUserId);
        });
      }
    }
  }, [currentUserId, loadMe, refreshTokenHandler]);

  useEffect(() => {
    loadMeWithRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentUserId]);

  const loadCollectionsData = useCallback(
    async (id: number) => {
      const collectionsResponse = await fetch(
        `${API_URL}/all_user_collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            LibAuthentication: accessToken || "",
            LibRefreshAuthentication: refreshToken || "",
          },
          body: JSON.stringify({
            user_id: id,
          }),
        }
      );

      const collectionsData: {
        success: boolean;
        message: string;
        collections: ICollection[];
      } = await collectionsResponse.json();

      if (!collectionsData.success) {
        if (collectionsData.message === "TOKEN_EXPIRED") {
          toast("expired session. refreshing tokens", {
            autoClose: 2000,
            type: "info",
          });

          return "REPEAT";
        }

        toast(collectionsData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
        return;
      }

      const userColls = collectionsData.collections.filter(
        (collection) => collection.author === me.name
      );

      console.log("collections", userColls);

      setCollections(userColls);
    },
    [me.name, accessToken, refreshToken]
  );

  const loadReadBooks = useCallback(
    async (id: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await loadBooksByStatus("read", id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, loadBooksByStatus]
  );

  const loadCompleteBooks = useCallback(
    async (id: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await loadBooksByStatus("complete", id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, loadBooksByStatus]
  );

  const loadReadingBooks = useCallback(
    async (id: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await loadBooksByStatus("reading", id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, loadBooksByStatus]
  );

  const loadReviews = useCallback(
    async (id: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await loadUserReviews(id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, loadUserReviews]
  );

  const loadFriends = useCallback(
    async (id: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await loadFriendsData(id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, loadFriendsData]
  );

  const loadCollections = useCallback(
    async (id: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await loadCollectionsData(id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, loadCollectionsData]
  );

  const loadCurrentBooks = useCallback(
    (filter: filtersType) => {
      if (filter === "read" && currentUserId) {
        loadReadBooks(currentUserId);
        return;
      }

      if (filter === "completed" && currentUserId) {
        loadCompleteBooks(currentUserId);
        return;
      }

      if (filter === "reading" && currentUserId) {
        loadReadingBooks(currentUserId);
        return;
      }

      if (filter === "reviews" && currentUserId) {
        loadReviews(currentUserId);
        return;
      }

      if (filter === "collections" && currentUserId) {
        loadCollections(currentUserId);
        return;
      }

      if (filter === "friends" && currentUserId) {
        loadFriends(currentUserId);
        return;
      }
    },
    [
      loadCompleteBooks,
      loadReadBooks,
      loadReadingBooks,
      loadReviews,
      loadCollections,
      loadFriends,
      currentUserId,
    ]
  );

  useEffect(() => {
    console.log("id", currentUserId);
    // loadBooks();
    if (currentUserId) {
      loadCurrentBooks(filter);
      loadMe(currentUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  let currentMonth = 0;

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <Flex className={style.pageContent}>
        <ProfileSection {...me} onChangeInfo={changeInfoSuccessHandler} isMe />

        <Tabs
          defaultActiveKey="read"
          activeKey={filter}
          onChange={(activeKey: string) => {
            const newFilter = activeKey as filtersType;
            setFilter(newFilter);
            loadCurrentBooks(newFilter);
          }}
          className={style.tabsWrapper}
          type="card"
          tabBarStyle={{
            padding: "16px 18px",
            borderRadius: "25px 0 25px 0",
            transition: "0.3s",
          }}
          items={[
            {
              key: "read",
              label: (
                <span
                  style={{
                    color:
                      filter === "read" ? "rgba(43, 19, 19, 0.7)" : "white ",
                    fontSize: "18px",
                  }}
                >
                  read
                </span>
              ),

              children: (
                <Flex gap={20} wrap>
                  {books &&
                    books.map((item) => (
                      <BookCard key={item.book_id} {...item} />
                    ))}
                </Flex>
              ),
            },
            {
              key: "reading",
              label: (
                <span
                  style={{
                    color:
                      filter === "reading" ? "rgba(43, 19, 19, 0.7)" : "white ",
                    fontSize: "18px",
                  }}
                >
                  reading
                </span>
              ),
              children: (
                <Flex gap={20}>
                  {books &&
                    books.map((item) => (
                      <BookCard key={item.book_id} {...item} />
                    ))}
                </Flex>
              ),
            },
            {
              key: "completed",
              label: (
                <span
                  style={{
                    color:
                      filter === "completed"
                        ? "rgba(43, 19, 19, 0.7)"
                        : "white ",
                    fontSize: "18px",
                  }}
                >
                  completed
                </span>
              ),

              children: (
                <Flex gap={20}>
                  {books &&
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
                        const month = +book.date.substr(5, 2);
                        if (currentMonth !== month) {
                          currentMonth = month;
                          return (
                            <div
                              key={month}
                              className={style.monthAndBooksContainer}
                            >
                              <h1
                                className={classNames(
                                  style.monthTitle,

                                  Poppins.className
                                )}
                              >
                                {" "}
                                {getMonthName(month)}
                              </h1>
                              <div className={style.booksContainer}>
                                <BookCard key={book.book_id} {...book} />{" "}
                              </div>
                            </div>
                          );
                        }
                        return <BookCard key={book.book_id} {...book} />;
                      })}
                </Flex>
              ),
            },
            {
              key: "collections",
              label: (
                <span
                  style={{
                    color:
                      filter === "collections"
                        ? "rgba(43, 19, 19, 0.7)"
                        : "white ",
                    fontSize: "18px",
                  }}
                >
                  collections
                </span>
              ),
              children: (
                <Flex gap={20}>
                  {collections.map((collection) => (
                    <CollectionCard key={collection.id} {...collection} />
                  ))}
                </Flex>
              ),
            },
            {
              key: "reviews",
              label: (
                <span
                  style={{
                    color:
                      filter === "reviews" ? "rgba(43, 19, 19, 0.7)" : "white ",
                    fontSize: "18px",
                  }}
                >
                  reviews
                </span>
              ),
              children: (
                <Flex gap={20} wrap>
                  {reviews.map((review) => (
                    <ReviewCard key={review.review_id} {...review} />
                  ))}
                </Flex>
              ),
            },
            {
              key: "friends",
              label: (
                <span
                  style={{
                    color:
                      filter === "friends" ? "rgba(43, 19, 19, 0.7)" : "white ",
                    fontSize: "18px",
                  }}
                >
                  friends
                </span>
              ),
              children: (
                <Flex gap={20} wrap>
                  {friends.map((friend) => (
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
                </Flex>
              ),
            },
          ]}
        ></Tabs>
      </Flex>
    </PageWrapper>
  );
}
