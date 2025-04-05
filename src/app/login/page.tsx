"use client";

import { PageWrapper } from "@/components";
import { useCallback, useContext, useEffect, useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Typography, Input, Button, Form, Flex } from "antd";
import classNames from "classnames";
import { Bounce, toast } from "react-toastify";

import background from "../../../public/page-background-login.png";
import { Poppins } from "@/fonts";
import { useRouter } from "next/navigation";
import { API_URL, Pages } from "@/constants";
import { Controller, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "@/utils";
import { getRandomQuote } from "@/utils/quotes";

import FormItem from "antd/es/form/FormItem";
import Password from "antd/es/input/Password";
import style from "./page.module.css";

const { Paragraph, Title, Text } = Typography;

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

  const { updateUserId } = useContext(UserContext)!;
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(getRandomQuote());

    if (typeof window === "undefined") {
      return;
    }

    const item = window.localStorage.getItem("user_id");

    if (item !== null) {
      updateUserId(+item);
      router.replace(Pages.main);
    }
  }, [router, updateUserId]);

  const { handleSubmit, formState, control } = useForm<LoginValues>({
    resolver,
  });

  const handleLogin: SubmitHandler<LoginValues> = useCallback(
    async ({ login, password }) => {
      console.log("log", login, password);

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

      const data: { success: boolean; userId?: number; message?: string } =
        await response.json();

      if (!data.success && data.message) {
        toast(data.message, {
          autoClose: 2000,
          transition: Bounce,
          closeOnClick: true,
          type: "error",
        });

        return;
      }

      console.log("login data", data);

      if (data.success && data.userId !== undefined) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("user_id", `${data.userId}`);
        }

        updateUserId(data.userId);
        router.push(Pages.main);
      }
    },
    [formState.isValid, router, updateUserId]
  );

  const handleSignup = useCallback(() => {
    router.push(Pages.signup);
  }, [router]);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Flex
        className={style.glass}
        gap="70px"
        vertical
        justify="center"
        align="center"
      >
        <Flex
          className={style.loginWrapper}
          gap="30px"
          vertical
          justify="center"
          align="center"
        >
          <Title
            className={classNames(style.title, Poppins.className)}
            style={{ color: "white" }}
          >
            Welcome to forWords!
          </Title>

          <Form onFinish={handleSubmit(handleLogin)} className={style.controls}>
            <Controller
              name="login"
              control={control}
              render={({ field }) => (
                <FormItem
                  name={field.name}
                  className={style.loginFormItem}
                  rules={[{ required: true }]}
                >
                  <Input
                    {...field}
                    className={style.input}
                    autoComplete="off"
                    placeholder="login"
                  />
                </FormItem>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormItem name={field.name} rules={[{ required: true }]}>
                  <Password
                    {...field}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className={style.input}
                    autoComplete="off"
                    placeholder="password"
                  />
                </FormItem>
              )}
            />

            <Button
              className={style.loginButton}
              type="default"
              htmlType="submit"
            >
              <Text>Log in</Text>
            </Button>
          </Form>
        </Flex>

        <div className={style.bottomContent}>
          <Button
            onClick={handleSignup}
            className={classNames(style.signUpButton)}
            type="default"
          >
            <Text>Sign Up</Text>
          </Button>

          <Paragraph className={classNames(style.tip)}>{quote}</Paragraph>
        </div>
      </Flex>
    </PageWrapper>
  );
}
