"use client";

import { API_URL } from "@/constants";
import { useContext } from "react";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const useTokenRefresh = () => {
  const { accessToken, refreshToken, setAccess, setRefresh } =
    useContext(UserContext)!;

  const refreshTokenHandler = (id: number) => {
    fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify({ user_id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAccess(data.lib_access_token);
          setRefresh(data.lib_refresh_token);
          toast("tokens refreshed", {
            type: "success",
            autoClose: 2000,
            transition: Bounce,
            closeOnClick: true,
          });
        } else {
          toast(data.message, {
            type: "error",
            autoClose: 2000,
            transition: Bounce,
            closeOnClick: true,
          });
        }
      })
      .catch(() => {
        toast("error", {
          type: "error",
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
        });
      });
  };

  return refreshTokenHandler;
};


