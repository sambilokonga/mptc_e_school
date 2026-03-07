import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Loading from '../../components/trainee/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState(null)
  const { currency, isEducator, backendUrl, getToken } = useContext(AppContext)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])

  const statCards = dashboardData ? [
    {
      title: "Total Enrollments",
      value: dashboardData.enrolledStudentsData.length,
      icon: <Users className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      title: "Total Courses",
      value: dashboardData.totalCourses,
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    {
      title: "Total Earnings",
      value: `${currency}${dashboardData.totalEarnings}`,
      icon: <DollarSign className="w-8 h-8 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    }
  ] : []

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start gap-8 p-6 md:p-10 bg-gray-50/50 w-full'>

      <div className='w-full'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className='text-3xl font-extrabold text-gray-900'>Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-12'>
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center p-6 bg-white rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`p-4 rounded-xl ${card.bg} mr-5`}>
                {card.icon}
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900 mb-1'>{card.value}</p>
                <p className='text-sm font-medium text-gray-500'>{card.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Enrollments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-5xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm md:text-base"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className='text-lg font-bold text-gray-900'>Latest Enrollments</h2>
            <TrendingUp className="text-gray-400 w-5 h-5" />
          </div>
          <div className='w-full overflow-x-auto'>
            <table className='w-full min-w-[500px]'>
              <thead className='bg-gray-50 text-gray-500 text-xs uppercase tracking-wider text-left'>
                <tr>
                  <th className='px-6 py-4 font-semibold w-16 text-center hidden sm:table-cell rounded-tl-lg'>#</th>
                  <th className='px-6 py-4 font-semibold'>Student Details</th>
                  <th className='px-6 py-4 font-semibold'>Course Subscribed</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {dashboardData.enrolledStudentsData.length > 0 ? (
                  dashboardData.enrolledStudentsData.map((items, index) => (
                    <tr key={index} className='hover:bg-gray-50/50 transition-colors'>
                      <td className='px-6 py-4 text-center hidden sm:table-cell text-gray-500 font-medium'>
                        {index + 1}
                      </td>
                      <td className='px-6 py-4'>
                        <div className="flex items-center space-x-3">
                          <img src={items.student.imageUrl} alt={items.student.name} className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm' />
                          <span className='font-semibold text-gray-800'>{items.student.name}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4 font-medium text-gray-600'>
                        {items.courseTitle}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No recent enrollments to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  ) : <div className="h-screen flex items-center justify-center w-full bg-gray-50"><Loading /></div>
}

export default Dashboard
