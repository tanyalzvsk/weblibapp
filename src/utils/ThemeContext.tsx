"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

type ThemeType = "dark" | "light";

interface ThemeContextProps {
  currentTheme: ThemeType;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  const toggleTheme = useCallback(() => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }, [theme]);

  useEffect(() => {
    console.log("theme: ", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
