"use client";
import { API_USER_ID } from "@/constants";
import { useEffect, useState } from "react";

export const useUserState = () => {
  const [currentUserId, setCurrentUserId] = useState<number | 1>(API_USER_ID);

  const changeUserId = (id: number) => {
    setCurrentUserId(id);
  };

  const resetUserId = () => {
    setCurrentUserId(API_USER_ID);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window ? window.localStorage.getItem("user_id") : null;
      const newItem = item ? +item : API_USER_ID;

      if (+newItem !== currentUserId) {
        setCurrentUserId(newItem);
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    console.log("changed to:" + currentUserId);
  }, [currentUserId]);

  return {
    currentUserId,
    changeUserId,
    resetUserId,
  };
};
