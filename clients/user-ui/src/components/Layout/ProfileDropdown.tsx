"use client"
import useUser from '@/src/hooks/useUser';
import AuthScreen from '@/src/screens/AuthScreen';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg';
import Cookies from 'js-cookie';
import toast from "react-hot-toast"

const ProfileDropdown = () => {
    const [signedIn, setsignedIn] = useState(false);
    const [open, setOpen] = useState(true)
    const {user, loading} = useUser();

    useEffect(() => {
      if(!loading){
        setsignedIn(!!user)
      }
    },[loading, user, open]);

    const handleLogout = () => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      toast.success("Logout successfull!")
      window.location.reload()
    }
  return (
    <div className='flex items-center gap-4'>
       {signedIn ? (
         <Dropdown placement='bottom-end'>
         <DropdownTrigger>
             <Avatar 
             as="button"
             className='transition-transform'
             src={user?.avatar?.url}
             />
         </DropdownTrigger>
         <DropdownMenu aria-label='Profile Actions' variant='flat'>
             <DropdownItem key='profile' className='h-14 gap-2'>
                 <p className='font-semibold'>
                     Signed in as
                 </p>
                 <p className='font-semibold'>
                     {user?.email}
                 </p>
             </DropdownItem>
             <DropdownItem key='setting'>My Profile</DropdownItem>
             <DropdownItem key='all_orders'>All Orders</DropdownItem>
             <DropdownItem key='apply_to_be_a_sellter'>Apply to be a seller</DropdownItem>
             <DropdownItem key='logout' color='danger' onPress={handleLogout}>Logout</DropdownItem>
         </DropdownMenu>
         
     </Dropdown>
       ):(
        <CgProfile 
        className='text-2xl cursor-pointer'
        onClick={() => setOpen(!open)}
        />
       )}
       {
        open && (
          <AuthScreen setOpen={setOpen} />
        )
       }
    </div>
  )
}

export default ProfileDropdown