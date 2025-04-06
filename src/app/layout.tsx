"use client";

import { ThemeContext, ThemeProvider, UserProvider } from "@/utils";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { ToastContainer } from "react-toastify";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { useContext } from "react";

// export const metadata: Metadata = {
//   title: "weblib",
//   description: "Books application",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        <ThemeProvider>
          <ConfigProvider
            theme={{
              algorithm:
                currentTheme === "dark"
                  ? theme.darkAlgorithm
                  : theme.compactAlgorithm,
              components: {
                // Button: {
                //   colorPrimary: "#00b96b",
                //   algorithm: true, // Enable algorithm
                // },
                // Input: {
                //   colorPrimary: "#eb2f96",
                //   algorithm: true, // Enable algorithm
                // },
              },
              token: {
                colorPrimary: currentTheme === "dark" ? "#1890ff" : "#1677ff",
              },
            }}
            // button={{ className: 'my-button' }}
          >
            <AntdRegistry>
              <UserProvider>
                <div>{children}</div>
              </UserProvider>
            </AntdRegistry>
          </ConfigProvider>
        </ThemeProvider>

        <ToastContainer />
      </body>
    </html>
  );
}
