import { useCallback, useContext, useState, useMemo } from "react";
import style from "./ChallengeForm.module.css";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import {
  Resolver,
  ResolverError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { API_URL, API_USER_ID } from "@/constants";
import { Bounce, toast } from "react-toastify";
import { UserContext, ThemeContext } from "@/utils";

import { Flex } from "antd";

type ChallengeFormProps = {
  onSuccess: (want: number) => void;
};

type ChallengeFormValues = {
  bookNumber: number;
};

const customRes: Resolver<ChallengeFormValues> = async (values) => {
  const result: ResolverError<ChallengeFormValues> = { errors: {}, values };

  if (!values.bookNumber) {
    result.errors.bookNumber = {
      type: "required",
      message: "Number of books is required",
    };
  }
  return result;
};

export const ChallengeForm: React.FC<ChallengeFormProps> = ({ onSuccess }) => {
  const { handleSubmit, register, formState } = useForm<ChallengeFormValues>({
    resolver: customRes,
  });
  const [amount, setAmount] = useState("");
  const { currentUserId, accessToken, refreshToken } = useContext(UserContext)!;
  const { currentTheme, toggleTheme } = useContext(ThemeContext);

  const handleFormSubmit: SubmitHandler<ChallengeFormValues> = useCallback(
    async (state) => {
      if (!formState.isValid) {
        toast("Form is invalid! Check the data", {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "warning",
        });

        return;
      }

      if (!currentUserId) {
        toast("No user");
        return;
      }

      const response = await fetch(`${API_URL}/update_book_want`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          LibAuthentication: accessToken || "",
          LibRefreshAuthentication: refreshToken || "",
        },
        body: JSON.stringify({
          new_book_want: +state.bookNumber,
          user_id: currentUserId,
        }),
      });

      const data: { success: boolean; message: string } = await response.json();

      if (data.success) {
        toast("Your goal is submitted! Thank you!", {
          autoClose: 3000,
          transition: Bounce,
          closeOnClick: true,
          type: "success",
        });

        if (!data.success && data.message) {
          toast(data.message, {
            autoClose: 2000,
            transition: Bounce,
            closeOnClick: true,
            type: "error",
          });

          return;
        }
        onSuccess(state.bookNumber);
      }
    },
    [formState.isValid, onSuccess, currentUserId, accessToken, refreshToken]
  );
  const challengeThemeClassName = useMemo(() => {
    return "challenge-" + currentTheme;
  }, [currentTheme]);

  return (
    <div
      className={classNames(style.challenge, style[challengeThemeClassName])}
    >
      <Flex
        className={classNames(style.formTitle, style.titleOfForm)}
        style={{
          backgroundColor:
            currentTheme === "dark" ? "#fab1a066" : "rgb(43, 19, 19, 0.5)",
        }}
      >
        <h2 className={classNames(style.formHeaders, Poppins.className)}>
          Track your reading activity
        </h2>
      </Flex>

      <form className={style.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <div className={style.formInfo}>
          <div className={style.challengeInfo}>
            <label className={style.reviewTitle} htmlFor="amount">
              <h2 className={classNames(style.formHeaders, Poppins.className)}>
                How many books would you like to read this year?
              </h2>

              <input
                {...register("bookNumber")}
                className={style.numberInput}
                id="amount"
                value={amount}
                onChange={(e) => {
                  if (Number.isInteger(+e.target.value)) {
                    setAmount(e.target.value);
                  }
                }}
                style={{ appearance: "textfield" }}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className={classNames(style.challengeSendButton, Poppins.className)}
        >
          Done
        </button>
      </form>
    </div>
  );
};
export default ChallengeForm;
