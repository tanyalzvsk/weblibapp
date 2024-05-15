"use client";

import { PageWrapper, Menu } from "@/components";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, API_USER_ID } from "@/constants";
import { IUser } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
import { FriendCard } from "@/components/FriendCard";
import { UserContext, useAuthCheck } from "@/utils";
import { useRouter } from "next/navigation";

export default function Friends() {
  const [friends, setFriends] = useState<IUser[]>([]);
  const [nonFriends, setNonFriends] = useState<IUser[]>([]);
  const router = useRouter();

  const { currentUserId } = useContext(UserContext)!;

  useAuthCheck(router);

  const loadFriends = useCallback(async (id: number) => {
    const friendsResponse = await fetch(`${API_URL}/friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    });

    const friendsData: { success: boolean; friendsList?: IUser[] } =
      await friendsResponse.json();

    console.log("Friends", friendsData.friendsList);

    if (friendsData.success && friendsData.friendsList) {
      const filteredFriends = friendsData.friendsList.filter(
        (friend) => friend.id !== id
      );

      setFriends(filteredFriends);
    }
  }, []);

  const loadNonFriends = useCallback(async (id: number) => {
    const nonFriendsResponse = await fetch(`${API_URL}/non_friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    });

    const nonFriendsData: { success: boolean; nonFriendsList?: IUser[] } =
      await nonFriendsResponse.json();

    console.log("non Friends", nonFriendsData.nonFriendsList);

    if (nonFriendsData.success && nonFriendsData.nonFriendsList) {
      const filteredNonFriends = nonFriendsData.nonFriendsList.filter(
        (nonFriend) => nonFriend.id !== id
      );

      setNonFriends(filteredNonFriends);
    }
  }, []);

  useEffect(() => {
   if(currentUserId) {
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
