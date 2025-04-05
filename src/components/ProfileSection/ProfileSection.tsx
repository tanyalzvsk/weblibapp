"use client";

import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import style from "./ProfileSection.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
// import Image from "next/image";
import { API_URL, BASE_API_URL } from "@/constants";
import { IUser } from "@/types";
import { UserContext } from "@/utils";

import { Avatar, Space, Typography, Flex, Button, Input, Upload } from "antd";
import { cssTransition } from "react-toastify";
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

  const ref = useRef<HTMLInputElement | null>(null);

  const handleChangeAvatar = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

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
            color: "white",
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
                return false;
              }}
              showUploadList={false}
              accept="image/*"
            >
              <Button
                className={style.btn}
                style={{
                  borderRadius: "25px",
                  backgroundColor: "rgba(43, 19, 19, 0.7)",
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
                    backgroundColor: "rgba(43, 19, 19, 0.7)",
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
                    backgroundColor: "rgba(43, 19, 19, 0.7)",
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
              </Space>
              {""}
              <Text
                strong
                style={{ color: "rgba(43, 19, 19, 0.7)", fontSize: "16px" }}
              >
                {" "}
                {info}{" "}
              </Text>
            </Text>
          )}

          {isInfoRed && (
            <TextArea
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
                backgroundColor: "rgba(43, 19, 19, 0.7)",
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
          <Button className={style.friendButton} onClick={onAddFriend}  style={{
            borderRadius: "25px",
            backgroundColor: "rgba(43, 19, 19, 0.7)",
            color: "white",
            border: "none",
          }}>
            Add friend
          </Button>
        )}

        {isFriend && onRemoveFriend && (
          <Button className={style.friendButton} onClick={onRemoveFriend}  style={{
            borderRadius: "25px",
            backgroundColor: "rgba(43, 19, 19, 0.7)",
            color: "white",
            border: "none",
          }}>
            Remove friend
          </Button>
        )}
      </Flex>
    </section>
  );
};
