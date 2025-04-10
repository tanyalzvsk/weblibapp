"use client";

import React, { ReactNode, createContext, useState } from "react";

interface UserContextProps {
  currentUserId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  updateUserId: (newUserId: number | null) => void;
  setAccess: (accessToken: string | null) => void;
  setRefresh: (refreshToken: string | null) => void;
}

export const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUserId, setUserId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const updateUserId = (newUserId: number | null) => {
    setUserId(newUserId);
  };

  const setAccess = (accessToken: string | null) => {
    setAccessToken(accessToken);
  };

  const setRefresh = (refreshToken: string | null) => {
    setRefreshToken(refreshToken);
  };

  return (
    <UserContext.Provider
      value={{
        currentUserId,
        accessToken,
        refreshToken,
        updateUserId,
        setAccess,
        setRefresh,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
