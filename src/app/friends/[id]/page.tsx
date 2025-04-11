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
import { useCallback, useContext, useEffect, useState } from "react";
import { API_URL, filtersType } from "@/constants";
import { IUser, IBook, ICollection, IReview } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { ProfileSection } from "@/components/ProfileSection";
import { FriendCard } from "@/components/FriendCard";
import { UserContext, useAuthCheck } from "@/utils";
import { getMonthName } from "@/utils";

import { Tabs, Flex } from "antd";
import { toast, Bounce } from "react-toastify";

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

  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;

  useAuthCheck(router);

  const loadUserData = useCallback(async () => {
    const userResponse = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify(`${params.id}`),
    });

    const userData: { success: boolean; message: string } | IUser =
      await userResponse.json();

    console.log("user", userData);

    if ("message" in userData && !userData.success && userData.message) {
      toast(userData.message, {
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
        type: "error",
      });

      console.log("closed");
      return;
    }

    if ("id" in userData) {
      setUserFriend(userData);
    }
  }, [params.id, accessToken, refreshToken]);

  const loadIsFriendData = useCallback(
    async (id: number) => {
      const isFriendResponse = await fetch(`${API_URL}/is_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: id,
          friend_id: params.id,
        }),
      });

      const isFriendData: {
        success: boolean;
        message: string;
        is_friend: boolean;
      } = await isFriendResponse.json();

      if (!isFriendData.success && isFriendData.message) {
        toast(isFriendData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }
      console.log("is friend", isFriendData.success);

      if (isFriendData.success) {
        setIsFriend(isFriendData.is_friend);
      }
    },
    [params.id, accessToken, refreshToken]
  );

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
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id,
        }),
      });

      const friendsData: { success: boolean; message: string } =
        await addFriendRes.json();

      if (!friendsData.success && friendsData.message) {
        toast(friendsData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      setIsFriend(true);

      console.log("Add Friend? ", friendsData.success);
    },
    [currentUserId, accessToken, refreshToken]
  );

  const removeFriendReq = useCallback(
    async (friend_id: number) => {
      const removeFriendRes = await fetch(`${API_URL}/remove_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id,
        }),
      });

      const friendsData: { success: boolean; message: string } =
        await removeFriendRes.json();

      if (!friendsData.success && friendsData.message) {
        toast(friendsData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      setIsFriend(false);

      console.log("remove Friend? ", friendsData.success);
    },
    [currentUserId, accessToken, refreshToken]
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
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
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
    [params.id, accessToken, refreshToken]
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
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify({
        user_id: params.id,
      }),
    });

    const reviewData: {
      success: boolean;
      message: string;
      reviews: IReview[];
    } = await userReviewsResponse.json();

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
    setReviews(reviewData.reviews);
  }, [params.id, accessToken, refreshToken]);

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
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify({
        user_id: params.id,
      }),
    });

    const friendsData: {
      success: boolean;
      message: string;
      friendsList?: IUser[];
    } = await friendsResponse.json();

    console.log("Friends", friendsData.friendsList);

    if (!friendsData.success && friendsData.message) {
      toast(friendsData.message, {
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
        type: "error",
      });

      return;
    }
    if (friendsData.success && friendsData.friendsList) {
      setFriends(friendsData.friendsList);
    }
  }, [params.id, accessToken, refreshToken]);

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
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify({
        user_id: params.id,
      }),
    });

    const collectionsData: {
      success: boolean;
      message: string;
      collections: ICollection[];
    } = await collectionsResponse.json();

    const userColls = collectionsData.collections.filter(
      (collection) => collection.author === user?.name
    );

    console.log("collections", userColls);

    if (!collectionsData.success && collectionsData.message) {
      toast(collectionsData.message, {
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
        type: "error",
      });

      return;
    }
    setCollections(userColls);
  }, [params.id, user?.name, accessToken, refreshToken]);

  const loadCollections = useCallback(async () => {
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
        loadCollections();
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
      loadCollections,
      loadFriends,
    ]
  );

  useEffect(() => {
    if (currentUserId) {
      loadUserData();
      loadCurrentBooks(filter);
      loadIsFriendData(currentUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  let currentMonth = 0;

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <Flex className={style.pageContent}>
        <ProfileSection
          id={user ? user.id : 1}
          name={user ? user.name : "loading data..."}
          info={user ? user.info : ""}
          avatarUrl={user ? user.avatarUrl : ""}
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
                  {books.length > 0 &&
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
                  {books.length > 0 &&
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
                  {books.length > 0 &&
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
