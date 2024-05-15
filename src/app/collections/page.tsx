"use client";

import { PageWrapper, Menu, CollectionCard } from "@/components";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, API_USER_ID } from "@/constants";
import { ICollection } from "@/types";
import { useState, useCallback, useEffect, useContext } from "react";
import { UserContext, useAuthCheck } from "@/utils";
import { useRouter } from "next/navigation";

export default function Collections() {
  const [collections, setCollections] = useState<ICollection[]>([]);

  const { currentUserId } = useContext(UserContext)!;

  const router = useRouter();

  useAuthCheck(router);

  const loadCollectionsData = useCallback(async (id: number) => {
    //change USER id to user RN
    const collectionsResponse = await fetch(`${API_URL}/all_user_collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    });

    const collectionsData: { collections: ICollection[] } =
      await collectionsResponse.json();

    console.log("collections", collectionsData.collections);

    setCollections(collectionsData.collections);
  }, []);

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
