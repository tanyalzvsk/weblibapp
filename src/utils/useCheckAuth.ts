"use client";

import { Pages } from "@/constants";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const useAuthCheck = (currentRouter: AppRouterInstance) => {
  const {
    currentUserId,
    updateUserId,
    setAccess,
    setRefresh,
    accessToken,
    refreshToken,
  } = useContext(UserContext)!;

  useEffect(() => {
    if (currentUserId && accessToken && refreshToken) {
      return;
    }

    if (typeof window !== "undefined" && currentUserId === null) {
      const item = window.localStorage.getItem("user_id");
      const accessTokenStorage = window.localStorage.getItem("access_token");
      const refreshTokenStorage = window.localStorage.getItem("refresh_token");

      if (
        item === null ||
        accessTokenStorage === null ||
        refreshTokenStorage === null
      ) {
        toast.error("Not Authorized!");
        updateUserId(null);
        setAccess(null);
        setRefresh(null);

        currentRouter.replace(Pages.login);
      } else {
        updateUserId(+item);
        setAccess(accessTokenStorage);
        setRefresh(refreshTokenStorage);
      }
    } else {
      toast.error("Auth error!");
    }
  }, [currentRouter, currentUserId, updateUserId, setAccess, setRefresh, accessToken, refreshToken]);
};
