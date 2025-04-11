"use client";

import { PageWrapper } from "@/components";
import { useCallback, useContext } from "react";

import style from "./page.module.css";

import background from "../../../public/page-background-login.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, Pages } from "@/constants";
import { useRouter } from "next/navigation";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "@/utils";

type SignupValues = {
  login: string;
  password: string;
  passwordCopy: string;
  // email: string;
  // name: string;
  // info: string;
};

const resolver: Resolver<SignupValues> = async (values) => {
  return {
    values: values.login ? values : {},
    errors: !values.login
      ? {
          login: {
            type: "required",
            message: "login is required",
          },
        }
      : {},
  };
};

export default function Login() {
  const router = useRouter();
  const { updateUserId, setAccess, setRefresh } = useContext(UserContext)!;

  const { handleSubmit, register, formState } = useForm<SignupValues>({
    resolver,
  });

  const handleLogin = useCallback(
    ({}) => {
      router.replace(Pages.login);
    },
    [router]
  );

  const handleRegistration: SubmitHandler<SignupValues> = useCallback(
    async ({ login, password, passwordCopy }) => {
      if (!formState.isValid) {
        return;
      }
      if (password !== passwordCopy) {
        toast("passwords do not match", {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });
        return;
      }

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
          email: "willbeaddedsoon@mail.ru",
          // name: 'TEST',
          info: "will be added soon",
          // email,
          name: login,
          // info,
        }),
      });

      const data: {
        success: boolean;
        userId: number | undefined;
        message?: string;
        lib_access_token?: string;
        lib_refresh_token?: string;
      } = await response.json();

      console.log("me data", data);

      if (
        data.success &&
        data.userId !== undefined &&
        typeof window !== "undefined" &&
        data.lib_access_token &&
        data.lib_refresh_token
      ) {
        window.localStorage.setItem("user_id", `${data.userId}`);
        window.localStorage.setItem("access_token", `${data.lib_access_token}`);
        window.localStorage.setItem(
          "refresh_token",
          `${data.lib_refresh_token}`
        );

        setAccess(data.lib_access_token);
        setRefresh(data.lib_refresh_token);
        updateUserId(data.userId);
        router.push(Pages.main);
      }

      if (!data.success && data.message) {
        toast(data.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }
    },
    [formState.isValid, router, updateUserId, setAccess, setRefresh]
  );

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <div className={style.glass}>
        <div className={style.loginWrapper}>
          <h1 className={classNames(style.title, Poppins.className)}>
            Join us
          </h1>

          <form
            onSubmit={handleSubmit(handleRegistration)}
            className={style.controls}
          >
            <input
              {...register("login")}
              className={classNames(style.input, Poppins.className)}
              type="text"
              placeholder="login"
            />

            <input
              {...register("password")}
              className={classNames(style.input, Poppins.className)}
              type="password"
              placeholder="password"
            />

            <input
              {...register("passwordCopy")}
              className={classNames(style.input, Poppins.className)}
              type="password"
              placeholder="repeat password"
            />

            <button
              className={classNames(style.registerButton, Poppins.className)}
              type="submit"
            >
              Register
            </button>
          </form>
        </div>

        <div className={style.bottomContent}>
          <button
            className={classNames(style.loginButton, Poppins.className)}
            onClick={handleLogin}
          >
            Log in
          </button>

          <p className={classNames(style.tip, Poppins.className)}>
            tip: don&#39;t read books while driving a car
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
