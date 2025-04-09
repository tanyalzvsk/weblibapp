"use client";

import { PageWrapper, Menu } from "@/components";

import style from "./page.module.css";

import background from "../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import ChallengeForm from "@/components/ChallengeForm/ChallengeForm";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { API_URL, API_USER_ID } from "@/constants";
import { UserContext, useAuthCheck, ThemeContext } from "@/utils";
import { useRouter } from "next/navigation";
import { IFriendChallenge } from "@/types";

import { Progress, Typography, Flex } from "antd";
import { toast, Bounce } from "react-toastify";
const { Title } = Typography;

export default function Challenge() {
  const [challenge, setChallenge] = useState<{
    book_read: number;
    book_want: number;
    challenge_id: number;
  } | null>(null);
  const [friendsChallengeData, setFriendsChallengeData] = useState<
    IFriendChallenge[] | null
  >(null);
  const [isChallengeFormVisible, setIsChallengeFormVisible] =
    useState<boolean>(false);

  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;
  const { currentTheme } = useContext(ThemeContext);

  const router = useRouter();

  useAuthCheck(router);

  const loadUserChallenge = useCallback(
    async (id: number) => {
      const challengeResponse = await fetch(`${API_URL}/book_challenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          user_id: id,
        }),
      });

      const challengeData: {
        message: string;
        success: boolean;
        book_read: number;
        book_want: number;
        challenge_id: number;
      } = await challengeResponse.json();

      console.log("challengeData", challengeData.success);

      if (!challengeData.success && challengeData.message) {
        toast(challengeData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      setChallenge(challengeData);
    },
    [accessToken, refreshToken]
  );

  const loadFriendsChallenge = useCallback(
    async (id: number) => {
      const friendsChallengeResponse = await fetch(
        `${API_URL}/book_challenge/friends`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            LibAuthentication: accessToken || "",
            LibRefreshAuthentication: refreshToken || "",
          },
          body: JSON.stringify({
            user_id: id,
          }),
        }
      );

      const friendChallengeData: {
        friend_challenges: IFriendChallenge[];
        success: boolean;
        message: string;
      } = await friendsChallengeResponse.json();

      console.log("challengeData", friendChallengeData.success);
      if (!friendChallengeData.success && friendChallengeData.message) {
        toast(friendChallengeData.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }
      setFriendsChallengeData(friendChallengeData.friend_challenges);
      console.log(friendChallengeData);
    },
    [accessToken, refreshToken]
  );

  useEffect(() => {
    if (currentUserId) {
      loadUserChallenge(currentUserId);
      loadFriendsChallenge(currentUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const challengeList: IFriendChallenge[] = useMemo(() => {
    if (!friendsChallengeData || !currentUserId || !challenge) {
      return [];
    }

    const copy: IFriendChallenge[] = [
      ...friendsChallengeData,
      {
        friend_id: `${currentUserId}`,
        friend_name: "You",
        book_read: `${challenge.book_read}`,
        book_want: `${challenge.book_want}`,
      },
    ];

    copy.sort((a, b) => (+b.book_read - +a.book_read > 0 ? 1 : -1));

    return copy;
  }, [friendsChallengeData, currentUserId, challenge]);

  const progressPercentage =
    challenge && challenge.book_want > 0
      ? (challenge.book_read / challenge.book_want) * 100
      : 0;
  const challengeThemeClassName = useMemo(() => {
    return "challenge-" + currentTheme;
  }, [currentTheme]);

  const friendChallengeThemeClassName = useMemo(() => {
    return "friendChallenge-" + currentTheme;
  }, [currentTheme]);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Menu />

      <div className={style.pageContent}>
        <h1 className={classNames(style.pageTitle, Poppins.className)}>
          One year challenge
        </h1>

        <div className={style.wrap}>
          <div className={style.mainContent}>
            <div
              className={classNames(
                style.challenge,
                style[challengeThemeClassName]
              )}
            >
              <Flex
                className={classNames(style.formTitle, style.titleOfForm)}
                style={{
                  backgroundColor:
                    currentTheme === "dark"
                      ? "#fab1a066"
                      : "rgb(43, 19, 19, 0.5)",
                }}
              >
                <h2
                  className={classNames(style.formHeaders, Poppins.className)}
                >
                  Track your reading activity
                </h2>
              </Flex>
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
              <Progress
                percent={progressPercentage}
                status={progressPercentage === 100 ? "success" : "active"}
                format={() =>
                  `${challenge?.book_read} / ${challenge?.book_want}`
                }
                trailColor={currentTheme === "dark" ? "#dfe6e966" : "#dda3c899"}
                strokeColor={
                  currentTheme === "dark"
                    ? "##fdcb6e66"
                    : "rgba(245, 202, 123, 0.7)"
                }
                percentPosition={{ align: "center", type: "inner" }}
                size={{ height: 20 }}
              />
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

          <div
            className={classNames(
              style.friendChallenge,
              style[friendChallengeThemeClassName]
            )}
          >
            <p
              className={classNames(
                Poppins.className,
                style.friendChallengeRating
              )}
            >
              Rating
            </p>
            {challengeList.map((friend_challenge) => (
              <div
                className={classNames(style.friendChallengeWrap, {
                  [style.myFriendChallengeWrap]:
                    friend_challenge.friend_name === "You",
                })}
                key={friend_challenge.friend_id}
              >
                <p
                  className={classNames(
                    style.friendChallengeTextBold,
                    Poppins.className
                  )}
                >
                  {friend_challenge.friend_name}
                </p>
                <p
                  className={classNames(
                    style.friendChallengeText,
                    Poppins.className
                  )}
                >
                  Read {friend_challenge.book_read}
                </p>
                <p
                  className={classNames(
                    style.friendChallengeText,
                    Poppins.className
                  )}
                >
                  Want {friend_challenge.book_want}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
