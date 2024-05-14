"use client";

import { PageWrapper } from "@/components";
import { useCallback } from "react";

import style from "./page.module.css";

import background from "../../../public/page-background-login.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { API_URL, Pages } from "@/constants";
import { useRouter } from "next/navigation";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";

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

  const { handleSubmit, register, formState } = useForm<SignupValues>({
    resolver,
  });

  const handleLogin = useCallback(
    async ({}) => {
      router.replace(Pages.login);
    },
    [router]
  );

  const handleRegistration: SubmitHandler<SignupValues> = useCallback(
    async ({ login, password }) => {
      if (!formState.isValid) {
        return;
      }

      //pass other info to this! (uncommecnt sections below)
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
          name: login + "TEST",
          // info,
        }),
      });

      const data: { success: boolean; userId: number | undefined } =
        await response.json();

      console.log("me data", data);

      if (
        data.success &&
        data.userId !== undefined &&
        typeof window !== "undefined"
      ) {
        window.localStorage.setItem("user_id", `${data.userId}`);
        router.push(Pages.main);
      }
    },
    [formState.isValid, router]
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
