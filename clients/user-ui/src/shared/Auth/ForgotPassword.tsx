import styles from "@/src/utils/style";
import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { FORGOT_PASSWORD } from "@/src/graphql/actions/forgot-password.action";

const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {

    const [ForgotPassword, {loading}] = useMutation(FORGOT_PASSWORD)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const response = await ForgotPassword({
        variables:{
            email:data.email,
        }
      });
      toast.success("Please check your email to reset your password")
      console.log(response);
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
    reset();
  };
  return (
    <div>
      <h1 className={`${styles.title}`}>Forgot your password?</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="login@gmail.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">{`${errors.email.message}`}</span>
        )}

        <input
          type="submit"
          value="Submit"
          disabled={isSubmitting || loading}
          className={`${styles.button} my-4 rounded-lg`}
        />

        <br />

        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Or Go Back To?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default ForgotPassword;
