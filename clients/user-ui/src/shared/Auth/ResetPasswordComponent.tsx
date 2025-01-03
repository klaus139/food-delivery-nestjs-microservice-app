"use client";
import styles from "@/src/utils/style";
import React, { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at lease 8 characters long!"),
  confirmPassword: z.string(),
}).refine(
  (values) => {
    return values.password === values.confirmPassword
  },{
    message:"Password does not match",
    path:["confirmPassword"],
  }
)

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPasswordComponent = ({
  activationToken,
}: {
  activationToken: string | string[] | undefined;
}) => {
  const [show, setShow] = useState(false);
  const [confirmPassshow, setConfirmPassShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    console.log(data);
  };
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="md:w-[500px] w-full">
        <h1 className={`${styles.title}`}>Reset Your Password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              Enter your password
            </label>
            <input
              {...register("password")}
              type={!show ? "password" : "text"}
              placeholder="password@#$%"
              className={`${styles.input} `}
            />

            {!show ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShow(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShow(false)}
              />
            )}
          </div>
          {errors.password && (
            <span className="text-red-500 block mt-1">{`${errors.password.message}`}</span>
          )}
          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type={!confirmPassshow ? "password" : "text"}
              placeholder="password@#$%"
              className={`${styles.input} `}
            />

            {!confirmPassshow ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setConfirmPassShow(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setConfirmPassShow(false)}
              />
            )}
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 block mt-1">{`${errors.confirmPassword.message}`}</span>
          )}
          <div className="w-full mt-5">
            <input
              type="submit"
              value="Submit"
              disabled={isSubmitting}
              className={`${styles.button} mt-2`}
            />
          </div>
          <br />
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
