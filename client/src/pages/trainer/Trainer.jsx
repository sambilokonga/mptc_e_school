import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/trainer/Navbar'
import Sidebar from '../../components/trainer/Sidebar'
import Footer from '../../components/trainer/Footer'

const Trainer = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
          {<Outlet />}
        </div>
        
      </div>
      <Footer />
    </div>
  )
}

export default Trainer
