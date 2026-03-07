import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/trainee/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BookOpen, DollarSign, Users, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

const MyCourses = () => {

  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext)
  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      data.success ? setCourses(data.courses) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses()
    }
  }, [isEducator])

  return courses ? (
    <div className='min-h-[calc(100vh-73px)] p-6 md:p-10 bg-gray-50/50 w-full'>
      <div className='w-full max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className='text-3xl font-extrabold text-gray-900'>My Courses</h1>
          <p className="text-gray-500 mt-1">Manage your active courses and track their performance.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'
        >
          <div className='w-full overflow-x-auto'>
            <table className='w-full min-w-[700px] text-left'>
              <thead className='bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider'>
                <tr>
                  <th className='px-6 py-4 font-semibold rounded-tl-xl'>
                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Course</div>
                  </th>
                  <th className='px-6 py-4 font-semibold'>
                    <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Earnings</div>
                  </th>
                  <th className='px-6 py-4 font-semibold'>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Students</div>
                  </th>
                  <th className='px-6 py-4 font-semibold rounded-tr-xl'>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Published On</div>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 text-sm'>
                {courses.length > 0 ? courses.map((course) => {
                  const studentCount = course.enrolledStudents?.length || 0
                  const finalPrice = course.coursePrice - (course.discount * course.coursePrice) / 100

                  return (
                    <tr key={course._id} className='hover:bg-gray-50/50 transition-colors group'>
                      <td className='px-6 py-4'>
                        <div className="flex items-center gap-4">
                          <img src={course.courseThumbnail} alt={course.courseTitle} className='w-20 h-14 object-cover rounded-md border border-gray-100 shadow-sm group-hover:shadow transition-shadow' />
                          <span className='font-semibold text-gray-800 line-clamp-2 max-w-xs'>
                            {course.courseTitle}
                          </span>
                        </div>
                      </td>

                      <td className='px-6 py-4 font-medium text-emerald-600'>
                        {currency}{Math.floor(studentCount * finalPrice)}
                      </td>

                      <td className='px-6 py-4'>
                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs">
                          {studentCount}
                        </span>
                      </td>

                      <td className='px-6 py-4 text-gray-500 font-medium'>
                        {new Date(course.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      You haven't published any courses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  ) : <div className="min-h-screen flex w-full items-center justify-center bg-gray-50"><Loading /></div>
}

export default MyCourses
