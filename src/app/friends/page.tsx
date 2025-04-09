"use client";

import { PageWrapper, Menu } from "@/components";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL } from "@/constants";
import { IUser } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
import { FriendCard } from "@/components/FriendCard";
import { UserContext, useAuthCheck } from "@/utils";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";

export default function Friends() {
  const [friends, setFriends] = useState<IUser[]>([]);
  const [nonFriends, setNonFriends] = useState<IUser[]>([]);
  const router = useRouter();

  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;

  useAuthCheck(router);

  const loadFriends = useCallback(
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

      const friendsData: { success: boolean; message: string; friendsList?: IUser[] } =
        await friendsResponse.json();

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
        const filteredFriends = friendsData.friendsList.filter(
          (friend) => friend.id !== id
        );

        setFriends(filteredFriends);
      }
    },
    [accessToken, refreshToken]
  );

  const loadNonFriends = useCallback(
    async (id: number) => {
      const nonFriendsResponse = await fetch(`${API_URL}/non_friends`, {
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

      const nonFriendsData: {
        success: boolean;
        message: string;
        nonFriendsList?: IUser[];
      } = await nonFriendsResponse.json();

      console.log("non Friends", nonFriendsData.nonFriendsList);

      if (!nonFriendsData.success && nonFriendsData.message) {
        toast(nonFriendsData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      if (nonFriendsData.success && nonFriendsData.nonFriendsList) {
        const filteredNonFriends = nonFriendsData.nonFriendsList.filter(
          (nonFriend) => nonFriend.id !== id
        );

        setNonFriends(filteredNonFriends);
      }
    },
    [accessToken, refreshToken]
  );

  useEffect(() => {
    if (currentUserId) {
      loadFriends(currentUserId);
      loadNonFriends(currentUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const handleSuccess = useCallback(
    (id: number, stat: "add" | "remove") => {
      if (stat === "add") {
        const friend = nonFriends.find((friend) => {
          return friend.id === id;
        });

        if (friend?.name) {
          setFriends([friend, ...friends]);
          setNonFriends(nonFriends.filter((nonFriend) => nonFriend.id !== id));
        }
      }

      if (stat === "remove") {
        const nonFriend = friends.find((friend) => friend.id === id);

        if (nonFriend?.name) {
          setNonFriends([nonFriend, ...nonFriends]);
          setFriends(friends.filter((friend) => friend.id !== id));
        }
      }
    },
    [friends, nonFriends]
  );

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <div className={style.section}>
          <h1 className={classNames(style.pageTitle, Poppins.className)}>
            Friends
          </h1>

          <div className={style.mainContent}>
            {friends.map((friend) => (
              <FriendCard
                isFriend
                {...friend}
                key={friend.name + friend.id}
                onSuccess={(id) => {
                  handleSuccess(id, "remove");
                }}
              />
            ))}
          </div>
        </div>

        <div className={style.section}>
          <h1 className={classNames(style.pageTitle, Poppins.className)}>
            All available users
          </h1>

          <div className={style.mainContent}>
            {nonFriends.map((nonFriend) => (
              <FriendCard
                {...nonFriend}
                key={nonFriend.name + nonFriend.id}
                onSuccess={(id) => {
                  handleSuccess(id, "add");
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
