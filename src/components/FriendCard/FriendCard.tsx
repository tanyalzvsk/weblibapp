"use client";

import {
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import style from "./FriendCard.module.css";
import { IUser } from "@/types";
import { Poppins } from "@/fonts";
import classNames from "classnames";
import {
  UserContext,
  generateRandomColorLight,
  generateRandomColorDark,
  ThemeContext,
} from "@/utils";
import { API_URL, BASE_API_URL } from "@/constants";
import { useRouter } from "next/navigation";

import { Avatar } from "antd";

export interface FriendCardProps extends IUser {
  isFriend?: boolean;
  isMe?: boolean;
  isImmutable?: boolean;
  backgroundColor?: string;
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
  backgroundColor = "",
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentUserId } = useContext(UserContext)!;

  const { currentTheme } = useContext(ThemeContext);

  const bgColor: string = useMemo(() => {
    return currentTheme === "light"
      ? generateRandomColorLight()
      : generateRandomColorDark();
  }, [currentTheme]);

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

  const deleteFriendThemeClassName = useMemo(() => {
    return "deleteFriendButton-" + currentTheme;
  }, [currentTheme]);

  const addFriendThemeClassName = useMemo(() => {
    return "addFriendButton-" + currentTheme;
  }, [currentTheme]);


  return (
    <div
      className={classNames(style.card, {
        [style.loading]: isLoading,
      })}
      style={{ backgroundColor: backgroundColor ? backgroundColor : bgColor }}
      onClick={handleUserClick}
    >
      {avatarUrl ? (
        <div className={style.imageWrapper}>
          <Avatar
            src={`${BASE_API_URL}/avatars/${avatarUrl}`}
            alt={`${name} image`}
            size={96}
            style={{ borderRadius: "5px" }}
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
            className={classNames(style.deleteFriendButton, style[deleteFriendThemeClassName], Poppins.className)}
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
            className={classNames(style.addFriendButton, style[addFriendThemeClassName], Poppins.className)}
          >
            Add
          </button>
        )}

        {isMe && <p>(You)</p>}
      </div>
    </div>
  );
};
