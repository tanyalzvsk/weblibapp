import { UserProvider } from "@/utils";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { ToastContainer } from "react-toastify";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";


export const metadata: Metadata = {
  title: "weblib",
  description: "Books application",
};

export default function RootLayout({
 
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <NextTopLoader />

        <ConfigProvider>
          <AntdRegistry>
            <UserProvider>
              <div>{children}</div>
            </UserProvider>
          </AntdRegistry>
        </ConfigProvider>

        <ToastContainer />
      </body>
    </html>
  );
}
