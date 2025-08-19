"use client";

import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React, { useContext, useEffect, useState } from 'react'; // ✅ added useState
import Header from './_components/Header';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const CreateUser = useMutation(api.user.CreateNewUser);
   const { user } = useUser();
   const [userDetail,setUserDetail]=useState<any>();

   const CreateNewUser = async () => {
     if (user) {
       // Save New User if Not Exist
       const result = await CreateUser({
         email: user?.primaryEmailAddress?.emailAddress ?? '',
         imageUrl: user?.imageUrl,
         name: user?.fullName ?? ''
       });
       setUserDetail(result);
     }
   };

   useEffect(() => {
     if (user) {
       CreateNewUser();
     }
   }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail}}>
    <div>
        <Header />
        {children}
    </div>
    </UserDetailContext.Provider>
  )
}

export default Provider;


export const useUserDetail = () => {
  return useContext(UserDetailContext);
}
