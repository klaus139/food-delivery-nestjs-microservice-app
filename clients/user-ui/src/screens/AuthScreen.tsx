import React from 'react'
import Login from '../shared/Auth/Login'

const AuthScreen = () => {
  return (
    <div className='w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-[#00000032]'>
        <div className=' bg-slate-900 p-3 rounded-sm shadow-sm w-[30%]'>
            <Login />

        </div>

    </div>
  )
}

export default AuthScreen