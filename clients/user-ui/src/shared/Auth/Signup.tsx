
"use client"
import styles from '@/src/utils/style'
import React,{useState} from 'react'
import {z} from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useMutation } from '@apollo/client'
import { REGISTER_USER } from '@/src/graphql/actions/register.action'
import toast from "react-hot-toast"

const formSchema = z.object({
    name:z.string().min(3, "Name must be 3 characters long"),
    email: z.string().email(),
    password:z.string().min(8, "Password must be at lease 8 characters long!"),
    phone_number:z.number().min(11, "Number must be 9 at least 11 characters")

})

type SignUpSchema = z.infer<typeof formSchema>;

const Signup = ({setActiveState}:{setActiveState:(e:string) => void}) => {
    const [registerUserMutation, {loading}] = useMutation(REGISTER_USER)

    const [show, setShow] = useState(false)
        const {register, handleSubmit, formState:{errors, isSubmitting}, reset} = useForm<SignUpSchema>({
            resolver:zodResolver(formSchema),
        });
    
        const onSubmit = async(data: SignUpSchema) => {
            try{
                const response = await registerUserMutation({
                    variables: data,
                });
                localStorage.setItem("activation_token", response.data.register.activation_token)
                console.log(response)
                toast.success("please check your mail to activate your account!")
                reset()
                setActiveState("Verification")


            }catch(error:any){
                console.log(error)
                toast.error(error.message)
            }
            reset();
        }
  return (
    <div>
  
    <h1 className={`${styles.title}`}>
        Sign up to KD Logistics
    </h1>
    <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>
            Enter your Name
        </label>
        <input {...register("name")} type='text' placeholder='John Doe'  className={`${styles.input}`}/>
        {errors.name && (
            <span className='text-red-500 block mt-1'>{`${errors.name.message}`}</span>
        )}

        <div className='w-full mt-2 relative mb-1'>
        <label className={`${styles.label}`}>
            Enter your Email
        </label>
        <input {...register("email")} type='text' placeholder='example@gmail.com'  className={`${styles.input}`}/>
        {errors.email && (
            <span className='text-red-500 block mt-1'>{`${errors.email.message}`}</span>
        )}
        </div>
        <div className='w-full mt-2 relative mb-1'>
        <label className={`${styles.label}`}>
            Enter your Phone Number
        </label>
        <input {...register("phone_number", {valueAsNumber:true})} type='number' placeholder='+23480********'  className={`${styles.input}`}/>
        {errors.phone_number && (
            <span className='text-red-500 block mt-1'>{`${errors.phone_number.message}`}</span>
        )}
        </div>
        <div className='w-full mt-2 relative mb-1'>
            <label htmlFor='password' className={`${styles.label}`}>
                Enter your password
            </label>
            <input {...register("password")} type={!show ? 'password' : 'text'}  placeholder='password@#$%' className={`${styles.input} `}/>
          
        {
            !show ? (
                <AiOutlineEyeInvisible 
                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                size={20}
                onClick={() => setShow(true)}
                />
            ):(
                <AiOutlineEye 
                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                size={20}
                onClick={() => setShow(false)}
                />
            )
        }
        </div>
        {errors.password && (
            <span className='text-red-500 block mt-1'>{`${errors.password.message}`}</span>
        )}
        <div className='w-full mt-2'>
       
            <input 
            type='submit'
            value='Sign Up'
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-2`}
            />

        </div>
        <br />
        <h5 className='flex items-center justify-center  text-[14px] text-white'>Or Join with</h5>
        <div className='flex items-center justify-center my-1'>
            <FcGoogle size={30} className='cursor-pointer mr-2'/>
            <AiFillGithub size={30} className='cursor-pointer ml-2'/>
        </div>
        <h5 className='text-center pt-4 font-Poppins text-[14px]'>
            Already have an account?{" "}
            <span className='text-[#2190ff] pl-1 cursor-pointer mb-1' onClick={() => setActiveState("Login")}>Login</span>
        </h5>
 
      
    </form>
</div>
  )
}

export default Signup