import React, { useContext, useState } from 'react'
import { assets } from "../../assets/assets"
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from "@clerk/clerk-react"
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)
  const location = useLocation()
  const isCourseListPage = location.pathname.includes("/course-list")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/trainer")
        return
      }

      const token = await getToken()
      const { data } = await axios.get(backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/course-list' },
    { name: 'About', path: '#' },
    { name: 'Contact', path: '#' },
  ]

  return (
    <div className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-200 py-4 transition-all duration-300 ${isCourseListPage ? "bg-white/90 backdrop-blur-md" : "bg-white/90 backdrop-blur-md shadow-sm"}`}>
      
      {/* Logo */}
      <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/")}>
        <img src={assets.mptc_logo} alt="Logo" className='w-8 lg:w-10' />
        <span className='font-bold text-2xl text-golden transition-transform duration-300 hover:scale-105'>MPTC</span>
      </div>

      {/* Desktop Navigation Links */}
      <div className='hidden md:flex items-center gap-8'>
        {navLinks.map((link, index) => (
          <Link 
            key={index} 
            to={link.path} 
            className='text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300'
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop Rights Side Details */}
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          {user && 
          <>
            <button onClick={becomeEducator} className="hover:text-blue-600 transition-colors duration-300 font-medium">{isEducator ? "Educator Dashboard" : "Become Educator"}</button> 
            <span className="text-gray-300">|</span>
            <Link to="/my-enrollments" className="hover:text-blue-600 transition-colors duration-300 font-medium">My Enrollments</Link>
          </>
          }
        </div>
        {user ? <UserButton /> :
        <button onClick={() => openSignIn()} className='bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg'>Create Account</button>}
      </div>
      
      {/* Mobile Right Side and Hamburger */}
      <div className='md:hidden flex items-center gap-4 text-gray-500'>
        {user ? <UserButton /> : <button onClick={() => openSignIn()} className="text-gray-600 hover:text-blue-600 transition-colors duration-300"><img src={assets.user_icon} alt="User" className="w-6 h-6" /></button>}
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 focus:outline-none">
          {/* Hamburger Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-200 py-4 flex flex-col items-center gap-4 md:hidden origin-top animate-pulse !animate-none">
          {navLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              className='text-gray-600 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-300 w-full text-center py-3'
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user && 
            <div className="flex flex-col items-center gap-4 w-full border-t border-gray-100 pt-4 mt-2">
              <button 
                onClick={() => { becomeEducator(); setIsMenuOpen(false); }} 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium w-full text-center py-2"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link 
                to="/my-enrollments" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium w-full text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                My Enrollments
              </Link>
            </div>
          }
        </div>
      )}

    </div>
  )
}

export default Navbar
