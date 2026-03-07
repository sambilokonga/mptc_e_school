import React, { useContext, useEffect, useState } from 'react'
import Loading from '../../components/trainee/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Search, GraduationCap, Calendar, BookOpen } from 'lucide-react'

const StudentsEnrolled = () => {

  const { backendUrl, getToken, isEducator } = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + "/api/educator/enrolled-students", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents()
    }
  }, [isEducator])

  return enrolledStudents ? (
    <div className='min-h-[calc(100vh-73px)] p-6 md:p-10 bg-gray-50/50 w-full'>
      <div className='w-full max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className='text-3xl font-extrabold text-gray-900'>Students Enrolled</h1>
            <p className="text-gray-500 mt-1">View all students currently enrolled in your courses.</p>
          </div>
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
                  <th className='px-6 py-4 font-semibold w-16 text-center'>#</th>
                  <th className='px-6 py-4 font-semibold'>
                    <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Student Profile</div>
                  </th>
                  <th className='px-6 py-4 font-semibold'>
                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Course Enrolled</div>
                  </th>
                  <th className='px-6 py-4 font-semibold'>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Enrollment Date</div>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 text-sm'>
                {enrolledStudents.length > 0 ? enrolledStudents.map((item, index) => (
                  <tr key={index} className='hover:bg-gray-50/50 transition-colors group'>
                    <td className='px-6 py-4 text-center text-gray-500 font-medium'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4'>
                      <div className="flex items-center gap-4">
                        <img src={item.student.image_Url} alt={item.student.name} className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm' />
                        <span className='font-semibold text-gray-800'>{item.student.name}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 truncate max-w-xs font-medium text-gray-700'>
                      {item.courseTitle}
                    </td>
                    <td className='px-6 py-4 text-gray-500 font-medium'>
                      {new Date(item.purchaseDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No students are currently enrolled in any of your courses.
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

export default StudentsEnrolled
