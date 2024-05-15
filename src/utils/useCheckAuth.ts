"use client";

import { Pages } from "@/constants";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const useAuthCheck = (currentRouter: AppRouterInstance) => {
  const { currentUserId, updateUserId } = useContext(UserContext)!;

  useEffect(() => {
    if (currentUserId) {
      return;
    }

    if (typeof window !== "undefined" && currentUserId === null) {
      const item = window.localStorage.getItem("user_id");

      if (item === null) {
        toast.error("Not Authorized!");
        updateUserId(null);
        currentRouter.replace(Pages.login);
      } else {
        updateUserId(+item);
      }
    } else {
      toast.error("Auth error!");
    }
  }, [currentRouter, currentUserId, updateUserId]);
};
