import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

  const {isEducator} = useContext(AppContext)

  const menuItems = [
    {name: "Dashboard", path: "/trainer", icon: assets.home_icon},
    {name: "Add Course", path: "/trainer/add-course", icon: assets.add_icon},
    {name: "My Courses", path: "/trainer/my-courses", icon: assets.my_course_icon},
    {name: "Student Enrolled", path: "/trainer/student-enrolled", icon: assets.person_tick_icon},
  ]

  return isEducator && (
    <div className='flex flex-col w-16 md:w-64 border-r min-h-screen bext-base border-gray-500 py-2'>
      { menuItems.map((item)=>(
        <NavLink
        to={item.path}
        key={item.name}
        end={item.path === "/trainer"}
        className={({isActive})=> `flex items-center flex-col md:flex-row justify-center md:justify-start py-3.5 md:px-10 gap-3 ${isActive ? "bg-indigo-50 border-r-[6px] border-indigo-500/90" : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/9 "}`}
        >
          <img src={item.icon} alt="" className='w-6 h-6'/>
          <p className='hidden md:block text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
