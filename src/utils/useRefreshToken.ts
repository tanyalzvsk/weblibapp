"use client";

import { API_URL, Pages } from "@/constants";
import { useContext } from "react";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "./UserContext";
import { useRouter } from "next/navigation";

export const useTokenRefresh = () => {
  const { accessToken, refreshToken, setAccess, setRefresh, updateUserId } =
    useContext(UserContext)!;
  const router = useRouter();

  const refreshTokenHandler = async (
    id: number,
    repeatFunc: () => Promise<void>
  ) => {
    const refreshResponse = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify({ user_id: id }),
    });

    const refreshResponseData:
      | { success: false; message: string }
      | {
          success: true;
          lib_refresh_token: string;
          lib_access_token: string;
        } = await refreshResponse.json();

    if (!refreshResponseData.success) {
      toast(refreshResponseData.message, {
        type: "error",
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
      });

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
      }

      setAccess(null);
      setRefresh(null);
      updateUserId(null);
      router.replace(Pages.login);

      return;
    }

    console.log("we update: ", refreshResponseData.lib_access_token);

    setAccess(refreshResponseData.lib_access_token);
    setRefresh(refreshResponseData.lib_refresh_token);
    window.localStorage.setItem(
      "access_token",
      refreshResponseData.lib_access_token
    );
    window.localStorage.setItem(
      "refresh_token",
      refreshResponseData.lib_refresh_token
    );
    toast("tokens refreshed", {
      type: "success",
      autoClose: 2000,
      transition: Bounce,
      closeOnClick: true,
    });

    await repeatFunc();
  };

  return refreshTokenHandler;
};
