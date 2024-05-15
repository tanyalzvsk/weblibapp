"use client";

import { PageWrapper, Menu } from "@/components";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import ChallengeForm from "@/components/ChallengeForm/ChallengeForm";
import { useCallback, useContext, useEffect, useState } from "react";
import { API_URL, API_USER_ID } from "@/constants";
import { UserContext, useAuthCheck } from "@/utils";
import { useRouter } from "next/navigation";
import { IFriendChallenge } from "@/types";

export default function Challenge() {
  const [challenge, setChallenge] = useState<{
    book_read: number;
    book_want: number;
    challenge_id: number;
  } | null>(null);
  const [firendsChallengeData, setFriendsChallengeData] = useState<
    IFriendChallenge[] | null
  >(null);
  const [isChallengeFormVisible, setIsChallengeFormVisible] =
    useState<boolean>(false);

  const { currentUserId } = useContext(UserContext)!;

  const router = useRouter();

  useAuthCheck(router);

  const loadUserChallenge = useCallback(async (id: number) => {
    const challengeResponse = await fetch(`${API_URL}/book_challenge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    });

    const challengeData: {
      success: boolean;
      book_read: number;
      book_want: number;
      challenge_id: number;
    } = await challengeResponse.json();

    console.log("challengeData", challengeData.success);

    if (challengeData.success) {
      setChallenge(challengeData);
    }
  }, []);

  const loadFriendsChallenge = useCallback(
    async (id: number) => {
      const firendsChallengeResponse = await fetch(
        `${API_URL}/book_challenge/friends`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: id,
          }),
        }
      );

      const friendChallengeData: {
        friend_challenges: IFriendChallenge[];
        success: boolean;
      } = await firendsChallengeResponse.json();

      console.log("challengeData", friendChallengeData.success);

      if (friendChallengeData.success) {
        setFriendsChallengeData(friendChallengeData.friend_challenges);
        console.log(friendChallengeData);
      }
    },
    []
  );

  useEffect(() => {
    if (currentUserId) {
      loadUserChallenge(currentUserId);
      loadFriendsChallenge(currentUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <h1 className={classNames(style.pageTitle, Poppins.className)}>
          One year challenge
        </h1>

        <div className={style.mainContent}>
          <div className={style.challenge}>
            <div className={classNames(style.formTitle, style.titleOfForm)}>
              <h2 className={classNames(style.formHeaders, Poppins.className)}>
                Track your reading activity
              </h2>
            </div>
            <p className={classNames(style.consistency, Poppins.className)}>
              Good job! Consistency is the key!
            </p>

            <div className={style.infoWrapper}>
              {" "}
              <div className={style.infoContainer}>
                <p className={classNames(style.bookInfo, Poppins.className)}>
                  Already read
                </p>
                <p className={classNames(style.bookInfo, Poppins.className)}>
                  {challenge?.book_read}
                </p>
              </div>
              <div className={style.infoContainer}>
                <p className={classNames(style.bookInfo, Poppins.className)}>
                  Your goal
                </p>
                <p className={classNames(style.bookInfo, Poppins.className)}>
                  {challenge?.book_want}
                </p>
              </div>{" "}
            </div>
            <button
              className={classNames(
                style.challengeSendButton,
                Poppins.className
              )}
              onClick={() => setIsChallengeFormVisible(true)}
            >
              Change
            </button>
          </div>
        </div>

        {challenge &&
          (challenge.book_read > challenge.book_want ||
            challenge.book_want === 0 ||
            isChallengeFormVisible) && (
            <ChallengeForm
              onSuccess={(want) => {
                setChallenge({
                  ...challenge,
                  book_want: want,
                });
                setIsChallengeFormVisible(false);
              }}
            />
          )}

        <div className={style.friendChallenge}>
          {firendsChallengeData &&
            firendsChallengeData.map((friend_challenge) => (
              <div key={friend_challenge.friend_id}>
                <p>{friend_challenge.friend_name}</p>
                <p>Read: {friend_challenge.book_read}</p>
                <p>Want: {friend_challenge.book_want}</p>
              </div>
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}
