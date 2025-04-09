"use client";

import { ThemeContext, ThemeProvider, UserProvider } from "@/utils";
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
