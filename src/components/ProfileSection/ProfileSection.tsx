"use client";

import { FC, useCallback, useContext, useEffect, useState } from "react";
import style from "./ProfileSection.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, BASE_API_URL } from "@/constants";
import { IUser } from "@/types";
import { ThemeContext, UserContext } from "@/utils";

import { Avatar, Space, Typography, Flex, Button, Input, Upload } from "antd";
import { toast, Bounce } from "react-toastify";
const { Title, Text } = Typography;
const { TextArea } = Input;

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
  const { currentTheme } = useContext(ThemeContext);

  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;

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
          LibAuthentication:  accessToken || '',
          LibRefreshAuthentication: refreshToken || '',
        },
        body: JSON.stringify({
          user_id: id,
          info: newVal,
        }),
      });

      const changeInfoData: { success: boolean; message: string; info: string } =
        await changeInfoReq.json();

      if (changeInfoData.success) {
        if (onChangeInfo) {
          onChangeInfo(changeInfoData.info);
          setIsInfoRed(false);
          setNewVal(changeInfoData.info);
        }
        else {
          toast(changeInfoData.message, {
            autoClose: 2000,
            transition: Bounce,
            closeOnClick: true,
            type: "error",
          });
        }
      }

      console.log("change info ", changeInfoData);
    },
    [newVal, onChangeInfo, accessToken, refreshToken]
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
      {avatar && (
        <Avatar
          src={`${BASE_API_URL}/avatars/${avatar}`}
          alt={`${name} image`}
          size={180}
          style={{ borderRadius: "16px" }}
        />
      )}

      <Flex className={style.profileInfo} vertical gap="middle">
        <Title
          level={3}
          style={{
            fontSize: "48px",
            color: currentTheme === "dark" ? "white" : "black",
            marginBottom: "0px",
          }}
          className={classNames(style.title, Poppins.className)}
        >
          {name}
        </Title>

        {isMe && (
          <Flex className={style.wrapfile}>
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
              }}
              showUploadList={false}
              accept="image/*"
            >
              <Button
                className={style.btn}
                style={{
                  borderRadius: "25px",
                  backgroundColor:
                    currentTheme === "dark"
                      ? "#ff767566"
                      : "rgba(43, 19, 19, 0.7)",
                  color: "white",
                  border: "none",
                }}
              >
                Change avatar
              </Button>
            </Upload>

            {selectedFile && !isInfoRed && (
              <Text className={classNames(Poppins.className, style.filename)}>
                {selectedFile.name}
              </Text>
            )}

            <Flex className={style.controlsBtn}>
              {selectedFile && !isInfoRed && (
                <Button
                  onClick={handleUpload}
                  className={style.btn}
                  style={{
                    borderRadius: "25px",
                    backgroundColor:
                      currentTheme === "dark"
                        ? "#ff767566"
                        : "rgba(43, 19, 19, 0.7)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Upload Avatar
                </Button>
              )}

              {selectedFile && !isInfoRed && (
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                  className={style.btn}
                  style={{
                    borderRadius: "25px",
                    backgroundColor:
                      currentTheme === "dark"
                        ? "#ff767566"
                        : "rgba(43, 19, 19, 0.7)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Unselect Avatar
                </Button>
              )}
            </Flex>
          </Flex>
        )}

        <Flex className={style.contentWrap}>
          {!isInfoRed && (
            <Text
              style={{
                color: "white",
              }}
              className={classNames(Poppins.className, style.info)}
            >
              <Space style={{ fontSize: "20px", fontWeight: "700" }}>
                About me:
              </Space>{" "}
              <Text
                strong
                style={{
                  color:
                    currentTheme === "dark" ? "#fab1a0" : "rgba(43, 19, 19)",
                  fontSize: "16px",
                }}
              >
                {info}
              </Text>
            </Text>
          )}

          {isInfoRed && (
            <TextArea
              style={{
                backgroundColor:
                  currentTheme === "dark"
                    ? "#fab1a066"
                    : "rgba(43, 19, 19, 0.2)",
                color: "white",
                border: "none",
              }}
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className={style.textarea}
              rows={2}
            />
          )}

          {!isInfoRed && isMe && (
            <Button
              onClick={() => {
                setIsInfoRed(true);
              }}
              className={style.btn}
              style={{
                borderRadius: "25px",
                backgroundColor:
                  currentTheme === "dark"
                    ? "#ff767566"
                    : "rgba(43, 19, 19, 0.7)",
                color: "white",
                border: "none",
              }}
            >
              Change bio
            </Button>
          )}

          {isInfoRed && (
            <div className={style.redInfo}>
              <Button
                className={style.btn}
                style={{
                  backgroundColor:
                    currentTheme === "dark"
                      ? "#ff767566"
                      : "rgba(43, 19, 19, 0.7)",
                  color: "white",
                  border: "none",
                }}
                onClick={() => {
                  if (currentUserId) {
                    changeInfo(currentUserId);
                  }
                }}
              >
                save
              </Button>
              <Button
                className={style.btn}
                style={{
                  backgroundColor:
                    currentTheme === "dark"
                      ? "#ff767566"
                      : "rgba(43, 19, 19, 0.7)",
                  color: "white",
                  border: "none",
                }}
                onClick={() => {
                  setIsInfoRed(false);

                  if (typeof info !== "undefined") {
                    setNewVal(info);
                  }
                }}
              >
                cancel
              </Button>
            </div>
          )}
        </Flex>

        {!isFriend && onAddFriend && (
          <Button
            className={style.friendButton}
            onClick={onAddFriend}
            style={{
              borderRadius: "25px",
              backgroundColor:
                currentTheme === "dark" ? "#ff767566" : "rgba(43, 19, 19, 0.7)",
              color: "white",
              border: "none",
            }}
          >
            Add friend
          </Button>
        )}

        {isFriend && onRemoveFriend && (
          <Button
            className={style.friendButton}
            onClick={onRemoveFriend}
            style={{
              borderRadius: "25px",
              backgroundColor: "rgba(43, 19, 19, 0.7)",
              color: "white",
              border: "none",
            }}
          >
            Remove friend
          </Button>
        )}
      </Flex>
    </section>
  );
};
