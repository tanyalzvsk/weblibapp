"use client";

import { PageWrapper } from "@/components";
import { useCallback, useEffect } from "react";

import style from "./page.module.css";

import background from "../../../public/page-background-login.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { useRouter } from "next/navigation";
import { API_URL, Pages } from "@/constants";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";

type LoginValues = {
  login: string;
  password: string;
};

const resolver: Resolver<LoginValues> = async (values) => {
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const item = window.localStorage.getItem("user_id");

    if (item !== null) {
      router.replace(Pages.main);
    }
  }, [router]);

  const { handleSubmit, register, formState } = useForm<LoginValues>({
    resolver,
  });

  const handleLogin: SubmitHandler<LoginValues> = useCallback(
    async ({ login, password }) => {
      if (!formState.isValid) {
        return;
      }

      console.log("data" + login + " " + password);

      const response = await fetch(`${API_URL}/signIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data: { success: boolean; userId?: number } = await response.json();

      console.log("login data", data);

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

  const handleSignup = useCallback(() => {
    router.push(Pages.signup);
  }, [router]);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <div className={style.glass}>
        <div className={style.loginWrapper}>
          <h1 className={classNames(style.title, Poppins.className)}>
            Welcome back
          </h1>

          <form onSubmit={handleSubmit(handleLogin)} className={style.controls}>
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

            <button
              className={classNames(style.loginButton, Poppins.className)}
              type="submit"
            >
              Log in
            </button>
          </form>
        </div>

        <div className={style.bottomContent}>
          <button
            onClick={handleSignup}
            className={classNames(style.signUpButton, Poppins.className)}
          >
            Sign Up
          </button>

          <p className={classNames(style.tip, Poppins.className)}>
            tip: don&#39;t read books while driving a car
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
