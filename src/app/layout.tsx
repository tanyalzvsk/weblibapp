import { UserProvider } from "@/utils";
import "./globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

        <UserProvider>
          <div>{children}</div>
        </UserProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
