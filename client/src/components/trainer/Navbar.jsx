import React from 'react'
import { Link } from "react-router-dom"
import { assets, dummyEducatorData } from '../../assets/assets'
import { useUser, UserButton } from "@clerk/clerk-react"

const Navbar = () => {

  const educatorData = dummyEducatorData
  const {user} = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 py-3 border-b border-gray-500'>
      <Link to="/">
      <img src={assets.mptc_logo} alt="logo" className='w-8 lg:w-10' />
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user ? user.fullName : "Trainer"}</p>
        {user ? <UserButton /> : <img src={assets.abebaw} alt="" className='max-w-8 rounded-full'/> }
      </div>
    </div>
  )
}

export default Navbar
