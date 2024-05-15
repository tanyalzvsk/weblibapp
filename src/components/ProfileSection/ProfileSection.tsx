"use client";

import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import style from "./ProfileSection.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import Image from "next/image";
import { API_URL, BASE_API_URL } from "@/constants";
import { IUser } from "@/types";
import { UserContext } from "@/utils";

export interface ProfileSectionProps extends IUser {
  name: string;
  isMe?: boolean;
  isFriend?: boolean;
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
  onChangeInfo?: (newInfo: string) => void;
}

export const ProfileSection: FC<ProfileSectionProps> = ({
  name,
  info,
  avatarUrl,
  isFriend,
  onAddFriend,
  onRemoveFriend,
  onChangeInfo,
  isMe = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string>(avatarUrl ? avatarUrl : "");
  const [isInfoRed, setIsInfoRed] = useState<boolean>(false);
  const [newVal, setNewVal] = useState<string>(info ? info : "");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const { currentUserId } = useContext(UserContext)!;

  const handleUpload = async () => {
    if (selectedFile && currentUserId) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      formData.append("user_id", `${currentUserId}`);

      const response = await fetch(`${API_URL}/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data: { success: boolean; message: string; avatarUrl: string } =
        await response.json();

      setAvatar(data.avatarUrl);
      setSelectedFile(null);

      console.log("data", data);
    }
  };

  const changeInfo = useCallback(
    async (id: number) => {
      const changeInfoReq = await fetch(`${API_URL}/changeInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id,
          info: newVal,
        }),
      });

      const changeInfoData: { success: boolean; info: string } =
        await changeInfoReq.json();

      if (changeInfoData.success) {
        if (onChangeInfo) {
          onChangeInfo(changeInfoData.info);
          setIsInfoRed(false);
          setNewVal(changeInfoData.info);
        }
      }

      console.log("change info ", changeInfoData);
    },
    [newVal, onChangeInfo]
  );

  useEffect(() => {
    if (avatarUrl) {
      setAvatar(avatarUrl);
    }
  }, [avatarUrl]);

  useEffect(() => {
    if (info) {
      setNewVal(info);
    }
  }, [info]);

  return (
    <section className={style.section}>
      <div className={style.avatarWrapper}>
        {avatar && (
          <Image
            src={`${BASE_API_URL}/avatars/${avatar}`}
            alt={`${name} image`}
            fill
            style={{ borderRadius: "16px" }}
          />
        )}
      </div>

      <div className={style.profileInfo}>
        <h3 className={classNames(style.title, Poppins.className)}>{name}</h3>

        {isMe && (
          <div>
            <input type="file" name="avatar" onChange={handleFileChange} />

            <button onClick={handleUpload}>Upload avatar</button>
          </div>
        )}

        <div>
          {!isInfoRed && <p>{info}</p>}

          {isInfoRed && (
            <textarea
              value={newVal}
              onChange={(e) => {
                setNewVal(e.target.value);
              }}
            >
              {newVal}
            </textarea>
          )}

          {!isInfoRed && isMe && (
            <button
              onClick={() => {
                setIsInfoRed(true);
              }}
            >
              Change
            </button>
          )}

          {isInfoRed && (
            <button
              onClick={() => {
                if (currentUserId) {
                  changeInfo(currentUserId);
                }
              }}
            >
              save
            </button>
          )}
          {isInfoRed && (
            <button
              onClick={() => {
                setIsInfoRed(false);
              }}
            >
              cancel
            </button>
          )}
        </div>

        {!isFriend && onAddFriend && (
          <button className={style.friendButton} onClick={onAddFriend}>
            Add friend
          </button>
        )}

        {isFriend && onRemoveFriend && (
          <button className={style.friendButton} onClick={onRemoveFriend}>
            Remove friend
          </button>
        )}
      </div>
    </section>
  );
};
