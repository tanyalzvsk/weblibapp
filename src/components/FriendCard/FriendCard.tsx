"use client";

import { FC, useCallback, useContext, useEffect, useState } from "react";
import style from "./FriendCard.module.css";
import { IUser } from "@/types";
import { Poppins } from "@/fonts";
import classNames from "classnames";
import Image from "next/image";
import { API_URL, BASE_API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { UserContext } from "@/utils";

export interface FriendCardProps extends IUser {
  isFriend?: boolean;
  isMe?: boolean;
  isImmutable?: boolean;
  onSuccess: (id: number, status?: "remove" | "add") => void;
}

export const FriendCard: FC<FriendCardProps> = ({
  id,
  avatarUrl = "",
  name,
  onSuccess,
  isFriend = false,
  isImmutable = false,
  isMe = false,
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentUserId } = useContext(UserContext)!;

  const addFriendReq = useCallback(
    async (friend_id: number, id: number) => {
      const addFriendRes = await fetch(`${API_URL}/add_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id,
          friend_id,
        }),
      });

      const friendsData: { success: boolean } = await addFriendRes.json();

      if (friendsData.success) {
        onSuccess(friend_id, "add");
      }

      console.log("Add Friend? ", friendsData.success);
    },
    [onSuccess]
  );

  const removeFriendReq = useCallback(
    async (friend_id: number, id: number) => {
      const removeFriendRes = await fetch(`${API_URL}/remove_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id,
          friend_id,
        }),
      });

      const friendsData: { success: boolean } = await removeFriendRes.json();

      if (friendsData.success) {
        onSuccess(friend_id, "remove");
      }

      console.log("remove Friend? ", friendsData.success);
    },
    [onSuccess]
  );

  const addFriend = useCallback(
    async (friend_id: number) => {
      if (!currentUserId) {
        return;
      }

      setIsLoading(true);

      try {
        await addFriendReq(friend_id, currentUserId);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [addFriendReq, currentUserId]
  );

  const deleteFriend = useCallback(
    async (friend_id: number) => {
      if (!currentUserId) return;
      setIsLoading(true);

      try {
        await removeFriendReq(friend_id, currentUserId);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [removeFriendReq, currentUserId]
  );

  const handleUserClick = useCallback(() => {
    router.replace(`/friends/${id}`);
  }, [router, id]);

  return (
    <div
      className={classNames(style.card, {
        [style.loading]: isLoading,
      })}
      onClick={handleUserClick}
    >
      {avatarUrl ? (
        <div className={style.imageWrapper}>
          <Image
            src={`${BASE_API_URL}/avatars/${avatarUrl}`}
            alt={`${name} image`}
            fill
          />
        </div>
      ) : (
        <div className={style.tmpIcon}></div>
      )}

      <div className={style.friendInfo}>
        <h5 className={classNames(style.nameTitle, Poppins.className)}>
          {name}
        </h5>

        {isFriend && !isMe && !isImmutable && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              deleteFriend(id);
            }}
            className={classNames(style.deleteFriendButton, Poppins.className)}
          >
            Delete
          </button>
        )}

        {!isFriend && !isMe && !isImmutable && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              addFriend(id);
            }}
            className={classNames(style.addFriendButton, Poppins.className)}
          >
            Add
          </button>
        )}

        {isMe && <p>(You)</p>}
      </div>
    </div>
  );
};
