import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from "rc-progress"
import Footer from '../../components/trainee/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { PlayCircle, Clock, CheckCircle } from 'lucide-react'

const MyEnrollements = () => {

  const { enrolledCourses, calculateCourseDuration, navigate, fetchUserEnrolledCourses, backendUrl,
    userData, getToken, calculateNoOfLectures } = useContext(AppContext)

  const [progressArray, setProgressArray] = useState([])

  const getCourseProgress = async () => {
    try {
      const tempProgressArray = await Promise.all(enrolledCourses.map(async (course) => {
        const token = await getToken()
        const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId: course._id }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        let totalLectures = calculateNoOfLectures(course);
        const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
        return { lectureCompleted, totalLectures }
      }))
      setProgressArray(tempProgressArray)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses()
    }
  }, [userData])

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress()
    }
  }, [enrolledCourses])

  return (
    <div className='bg-gray-50 min-h-screen pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8 md:px-12'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900'>My Enrollments</h1>
          <p className="text-gray-500 mt-2">Track your progress and continue learning.</p>
        </motion.div>

        {enrolledCourses.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6'>
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index]
                ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures
                : 0;
              const isCompleted = progress === 100;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className='bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center'
                >
                  <div className="relative shrink-0 sm:w-48 w-full group overflow-hidden rounded-xl">
                    <img src={course.courseThumbnail} alt={course.courseTitle} className='w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-500' />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <PlayCircle className="text-white w-12 h-12" onClick={() => navigate("/player/" + course._id)} />
                    </div>
                  </div>

                  <div className='flex-1 w-full'>
                    <h3 className='text-lg font-bold text-gray-900 line-clamp-2 md:mb-2 mb-4'>{course.courseTitle}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {calculateCourseDuration(course)}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                        {progressArray[index] ? `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}` : "0/0"} Lectures
                      </span>
                    </div>

                    <div className="space-y-2 w-full">
                      <div className="flex justify-between items-end text-sm">
                        <span className="font-semibold text-gray-700">{Math.round(progress)}% Complete</span>
                      </div>
                      <Line
                        strokeWidth={4}
                        trailWidth={4}
                        percent={progress}
                        strokeColor={isCompleted ? "#10b981" : "#2563eb"}
                        trailColor="#f1f5f9"
                        className='w-full rounded-full'
                      />
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 ${isCompleted
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        onClick={() => navigate("/player/" + course._id)}
                      >
                        {isCompleted ? <><CheckCircle className="w-4 h-4" /> Review Course</> : "Continue Learning"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">No enrollments yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Explore our courses and start learning today!</p>
            <button
              onClick={() => navigate("/course-list")}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MyEnrollements
