"use client";

import { PageWrapper, Menu, CollectionCard } from "@/components";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL } from "@/constants";
import { ICollection } from "@/types";
import { useState, useCallback, useEffect, useContext } from "react";
import { UserContext, useAuthCheck } from "@/utils";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";

export default function Collections() {
  const [collections, setCollections] = useState<ICollection[]>([]);

  const { currentUserId, accessToken, refreshToken} = useContext(UserContext)!;

  const router = useRouter();

  useAuthCheck(router);

  const loadCollectionsData = useCallback(async (id: number) => {

    const collectionsResponse = await fetch(`${API_URL}/all_user_collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication:  accessToken || '',
        LibRefreshAuthentication: refreshToken || '',
      },
      body: JSON.stringify({
        user_id: id,
      }),
    });

    const collectionsData: { success: boolean; message: string; collections: ICollection[] } =
      await collectionsResponse.json();

    console.log("collections", collectionsData.collections);
    if (!collectionsData.success && collectionsData.message) {
      toast(collectionsData.message, {
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
        type: "error",
      });

      return;
    }

    setCollections(collectionsData.collections);
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (currentUserId) {
      loadCollectionsData(currentUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <h1 className={classNames(style.pageTitle, Poppins.className)}>
          Collections
        </h1>

        <div className={style.mainContent}>
          {collections.map((item) => (
            <CollectionCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
