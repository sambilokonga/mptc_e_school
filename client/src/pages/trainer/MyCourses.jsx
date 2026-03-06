import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/trainee/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyCourses = () => {

  const {currency, backendUrl, getToken, isEducator} = useContext(AppContext)
  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async()=>{
      // setCourses(allCourses)
    try {
      const token = await getToken()
      // Make API call to fetch educator's courses
      const {data} = await axios.get(backendUrl + "/api/educator/courses", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      data.success ? setCourses(data.courses) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(isEducator){
      fetchEducatorCourses()
    }
  },[isEducator])

  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between p-4 md:p-8 pt-8 md:pb-0 pb-0'>
      <div className='w-full'>
        <h2 className='pb-4 text-lg font-medium'>My-courses</h2>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounde-md bg-white border border-gray-500/20'>
        <table className='md:table-auto table-fixed w-full overflow-hidden'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
              <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
              <th className='px-4 py-3 font-semibold truncate'>Students</th>
              <th className='px-4 py-3 font-semibold truncate'>Published On</th>
            </tr>
          </thead>
        <tbody className='text-gray-500 text-sm'>
          {courses.map((course) => {
            const studentCount = course.enrolledStudents?.length || 0
            const finalPrice =
              course.coursePrice -
              (course.discount * course.coursePrice) / 100

            return (
              <tr key={course._id} className='border-b border-gray-50/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                  <img src={course.courseThumbnail} alt="Course" className='w-16' />
                  <span className='truncate hidden md:block'>
                    {course.courseTitle}
                  </span>
                </td>

                <td className='px-4 py-3'>
                  {currency} {Math.floor(studentCount * finalPrice)}
                </td>

                <td className='px-4 py-3'>
                  {studentCount}
                </td>

                <td className='px-4 py-3'>
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            )
          })}
        </tbody>
        </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default MyCourses
