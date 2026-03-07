import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BookCopy, Users } from 'lucide-react'

const Sidebar = () => {

  const { isEducator } = useContext(AppContext)

  const menuItems = [
    { name: "Dashboard", path: "/trainer", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Add Course", path: "/trainer/add-course", icon: <PlusCircle className="w-5 h-5" /> },
    { name: "My Courses", path: "/trainer/my-courses", icon: <BookCopy className="w-5 h-5" /> },
    { name: "Students Enrolled", path: "/trainer/student-enrolled", icon: <Users className="w-5 h-5" /> },
  ]

  return isEducator && (
    <div className='flex flex-col w-20 md:w-64 border-r min-h-[calc(100vh-73px)] border-gray-200 bg-white py-6 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-10'>
      <div className="flex flex-col gap-2 px-3 md:px-4">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/trainer"}
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-4 px-3 md:px-5 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-blue-600' : 'group-hover:text-blue-500'}`}>
                  {item.icon}
                </div>
                <span className='hidden md:block whitespace-nowrap'>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
