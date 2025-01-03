import React, { FC, useRef, useState } from "react";
import styles from "@/src/utils/style";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useMutation } from "@apollo/client";
import { ACTIVATE_USER } from "@/src/graphql/actions/activation.action";
import toast from "react-hot-toast";

type Props = {
  setActiveState: (route: string) => void;
};
type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};
const Verification: FC<Props> = ({ setActiveState }) => {
  const [ActivateUser, { loading, error, data }] = useMutation(ACTIVATE_USER);
  const [invalidError, setInvalidError] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  //  const verificationHandler = async () => {
  //     const verificationNumber = Object.values(verifyNumber).join("");
  //     console.log('number',verificationNumber);
  //     const activationToken = localStorage.getItem("activation_token");
  //     console.log('token', activationToken);
  //     //console.log(verificationNumber, activationToken);
  //     if (verificationNumber.length !== 4) {
  //       setInvalidError(true);
  //       return;
  //     } else {
  //       // Send request for activation
  //       const data = {
  //         activationToken: activationToken, // Correctly pass the activation token
  //         activationCode: verificationNumber,
  //       };

  //       try {
  //         const { response }:any = await ActivateUser({
  //           variables: data,
  //           context: {
  //             headers: {
  //               Authorization: `Bearer ${activationToken}`,  // Add authorization header if needed
  //             },
  //           },
  //         });

  //         console.log(response); // Optional: check the response
  //       } catch (error: any) {
  //         console.log(error);
  //         toast.error(error.response?.message || "Something went wrong");
  //       }
  //     }
  // };

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    //console.log('number', verificationNumber);

    const activationToken = localStorage.getItem("activation_token");

    if (!activationToken) {
      // Redirect to login page if no activation token is found
      toast.error("token not found");
      setActiveState("Login");
    }

    //console.log('token', activationToken);

    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    const data = {
      activationToken: activationToken, // Correctly pass the activation token
      activationCode: verificationNumber,
    };

    try {
      const { data: mutationData } = await ActivateUser({
        variables: data,
        context: {
          headers: {
            Authorization: `Bearer ${activationToken}`, // Add authorization header if needed
          },
        },
      });

      console.log(mutationData); // Correctly log the response data
      if (mutationData?.activateUser?.user) {
        localStorage.removeItem('activation_token')
        toast.success("Account activated successfully!");
        setActiveState("Login");
        // Handle successful activation (e.g., navigate to the dashboard)
      }
    } catch (error: any) {
      console.log("Error during activation:", error);
      toast.error(error.message)

    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    // Move to the next or previous input based on value entered
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  return (
    <div className="flex w-full flex-col">
      <h1 className={`${styles.title}`}> Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="flex flex-col">
        <div className="m-auto w-full flex items-center flex-col justify-around">
          <div className="flex flex-row gap-3">
            {Object.keys(verifyNumber).map((key, index) => (
              <input
                key={key}
                ref={inputRefs[index]}
                className={`w-[55px] h-[55px] items-center justify-center bg-transparent border-[3px] gap-4 rounded-[10px] flex flex-row ${
                  invalidError ? "shake border-red-500" : "border-white"
                } text-center`} // Added text-center to center text horizontally
                placeholder=""
                maxLength={1}
                value={verifyNumber[key as keyof VerifyNumber]}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>
          <br />
          <br />
          <div className="flex flex-col">
            <div className="w-full flex justify-center flex-col ">
              <button
                className='bg-blue-600 text-white p-3 rounded-[20px]  w-auto max-w-[300px]'
                disabled={loading}
                onClick={verificationHandler}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
              Go back to sign in?
              <span
                className="text-[#2190ff] pl-1 cursor-pointer"
                onClick={() => setActiveState("Login")}
              >
                Sign In
              </span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
