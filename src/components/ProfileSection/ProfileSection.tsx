"use client";

import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import style from "./ProfileSection.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import Image from "next/image";
import { API_URL, BASE_API_URL } from "@/constants";
import avatarMOCK from "../../../public/avatar.png";
import { IUser } from "@/types";

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
  id,
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

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      formData.append("user_id", `${id}`);

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

  const changeInfo = useCallback(async () => {
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
  }, [id, newVal, onChangeInfo]);

  useEffect(() => {
    console.log("a", avatar);
  }, [avatar]);

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
        {avatar ? (
          <Image
            src={`${BASE_API_URL}/avatars/${avatar}`}
            alt={`${name} image`}
            fill
          />
        ) : (
          <Image
            className={style.avatar}
            src={avatarMOCK.src}
            alt="avatar"
            fill
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
                changeInfo();
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
