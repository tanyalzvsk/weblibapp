import { Pages } from "@/constants";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useAuthCheck = (currentRouter: AppRouterInstance) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem("user_id");

      if (item === null) {
        toast.error("Not Authorized!");
        currentRouter.replace(Pages.login);
      }
    } else {
      toast.error("Auth error!");
    }
  }, []);
};
