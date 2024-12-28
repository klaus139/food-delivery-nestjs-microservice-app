"use client"
import AuthScreen from '@/src/screens/AuthScreen';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import React, { useState } from 'react'
import { CgProfile } from 'react-icons/cg';

const ProfileDropdown = () => {
    const [signedIn, setsignedIn] = useState(false);
    const [open, setOpen] = useState(true)
  return (
    <div className='flex items-center gap-4'>
       {signedIn ? (
         <Dropdown placement='bottom-end'>
         <DropdownTrigger>
             <Avatar 
             as="button"
             className='transition-transform'
             src='https://i.pravatar.cc/150?u=a042581f4e29026024d'
             />
         </DropdownTrigger>
         <DropdownMenu aria-label='Profile Actions' variant='flat'>
             <DropdownItem key='profile' className='h-14 gap-2'>
                 <p className='font-semibold'>
                     Signed in as
                 </p>
                 <p className='font-semibold'>
                     Klaus
                 </p>
             </DropdownItem>
             <DropdownItem key='setting'>My Profile</DropdownItem>
             <DropdownItem key='all_orders'>All Orders</DropdownItem>
             <DropdownItem key='apply_to_be_a_sellter'>Apply to be a seller</DropdownItem>
             <DropdownItem key='logout' color='danger'>Logout</DropdownItem>
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
          <AuthScreen />
        )
       }
    </div>
  )
}

export default ProfileDropdown