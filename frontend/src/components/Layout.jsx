import React from 'react'
import { SignOutButton, UserProfile, UserButton } from '@clerk/clerk-react'

const Layout = () => {
  return (
    <>
    <UserButton />
    <SignOutButton>LogOUt</SignOutButton>
    </>
  )
}

export default Layout