"use client";

import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const useApiResponseAssistant = () => {
  const { updateUserId, setAccess, setRefresh } = useContext(UserContext)!;

  const apiResponseAssistant = useCallback(
    (message: string) => {
      if (message === "TOKEN_EXPIRED") {
        toast("expired session. refreshing tokens", {
          autoClose: 2000,
          type: "info",
        });

        return "REPEAT";
      }

      if (message === "INVALID_TOKEN") {
        toast("Invalid session", {
          autoClose: 2000,
          type: "warning",
        });

        // updateUserId(null);
        // setAccess(null);
        // setRefresh(null);

        return "QUIT";
      }
    },
    [setAccess, setRefresh, updateUserId]
  );

  return { apiResponseAssistant };
};
