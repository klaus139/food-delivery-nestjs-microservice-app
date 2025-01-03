import ResetPasswordComponent from '@/src/shared/Auth/ResetPasswordComponent';
import React from 'react'

const ResetPassword = ({searchParams}:{
   searchParams:{ [key:string]: string | string[] | undefined }
}) => {
    const activationToken =  searchParams["verify"] ?? "";

    //console.log('tokens active',activationToken)

  return (
    <div>
        <ResetPasswordComponent activationToken={activationToken} />
    </div>
  )
}

export default ResetPassword