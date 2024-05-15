"use client";

import React, { ReactNode, createContext, useState } from "react";

interface UserContextProps {
  currentUserId: number | null;
  updateUserId: (newUserId: number | null) => void;
}

export const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUserId, setUserId] = useState<number | null>(null);

  const updateUserId = (newUserId: number | null) => {
    setUserId(newUserId);
  };

  return (
    <UserContext.Provider value={{ currentUserId, updateUserId }}>
      {children}
    </UserContext.Provider>
  );
};
