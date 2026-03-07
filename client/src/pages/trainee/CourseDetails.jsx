import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/trainee/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/trainee/Footer'
import YouTube from "react-youtube"
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayCircle, Clock, CheckCircle, ChevronDown, ChevronUp, Star, Users, BookOpen } from 'lucide-react'

const CourseDetails = () => {

  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const { allCourses, calculateRating, calculateNoOfLectures,
    calculateCourseDuration, calculateChapterTime, currency,
    backendUrl, userData, getToken } = useContext(AppContext)

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id)
      if (data.success) {
        setCourseData(data.courseData)
        // Open first section by default
        if (data.courseData.courseContent && data.courseData.courseContent.length > 0) {
          setOpenSection({ 0: true })
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warning("Please login to enroll the course")
      }
      if (isAlreadyEnrolled) {
        return toast.warning("You have already enrolled this course")
      }
      const token = await getToken()
      const { data } = await axios.post(backendUrl + "/api/user/purchase", { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        window.location.replace(data.sessionUrl)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrollCourse?.includes(courseData._id))
    }
  }, [userData, courseData])

  const toggleSection = (index) => {
    setOpenSection((prev) => (
      { ...prev, [index]: !prev[index] }
    ))
  }

  return courseData ? (
    <div className='bg-gray-50 min-h-screen'>
      {/* Dynamic Header Banner */}
      <div className='relative bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white pt-24 pb-32 md:pb-48 px-8 md:px-36 overflow-hidden'>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative z-10 max-w-3xl'
        >
          <h1 className='text-3xl md:text-5xl font-extrabold leading-tight tracking-tight'>
            {courseData.courseTitle}
          </h1>
          <p className='mt-4 text-gray-300 text-lg line-clamp-2 md:line-clamp-none' dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 300) + "..." }}></p>

          <div className='flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-sm font-medium'>
            <div className='flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm'>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-bold">{calculateRating(courseData)}</span>
              <span className='text-gray-300 ml-1'>({courseData?.reviews?.length || 0} ratings)</span>
            </div>
            <div className='flex items-center gap-1.5 text-gray-300'>
              <Users className="w-4 h-4" />
              <span>{courseData?.enrolledStudnts?.length ?? 0} students</span>
            </div>
            <div className='flex items-center gap-1.5 text-gray-300'>
              <BookOpen className="w-4 h-4" />
              <span>By <b className="text-white ml-1">{courseData.educator.name}</b></span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 md:px-8 xl:px-36 -mt-20 md:-mt-36 flex flex-col-reverse md:flex-row gap-8 items-start justify-between pb-24'>

        {/* Left Column - Course Content */}
        <div className='w-full md:w-[60%] lg:w-[65%] mt-8 md:mt-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 z-10'>

          <div className='mb-10'>
            <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6'>
              Course Structure
            </h2>
            <div className='space-y-3 overflow-hidden rounded-xl border border-gray-200'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border-b last:border-b-0 border-gray-200 bg-gray-50/50'>
                  <div
                    className='flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-100/80 transition-colors'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-3 w-[70%]'>
                      <div className={`p-1.5 rounded-md transition-colors ${openSection[index] ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                        {openSection[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                      <p className='font-semibold text-gray-800 text-sm md:text-base leading-tight pr-2'>{chapter.chapterTitle}</p>
                    </div>
                    <div className='text-xs md:text-sm font-medium text-gray-500 w-[30%] text-right'>
                      {chapter.chapterContent.length} lessons • {calculateChapterTime(chapter)}
                    </div>
                  </div>

                  <AnimatePresence>
                    {openSection[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white"
                      >
                        <ul className='px-5 py-2'>
                          {chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b last:border-b-0 border-gray-100 group'>
                              <div className='flex items-start gap-3 flex-1'>
                                <PlayCircle className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                                <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors">{lecture.lectureTitle}</span>
                              </div>
                              <div className='flex items-center justify-end gap-3 pl-7 sm:pl-0 shrink-0 text-sm'>
                                {lecture.isPreviewFree && (
                                  <button
                                    onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split("/").pop() })}
                                    className='text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-4 decoration-blue-200 hover:decoration-blue-600 transition-all'
                                  >
                                    Preview
                                  </button>
                                )}
                                <span className='text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold'>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className='pt-8 border-t border-gray-100'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>Course Description</h3>
            <div className='prose prose-blue prose-sm md:prose-base max-w-none text-gray-600 rich-text' dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></div>
          </div>
        </div>

        {/* Right Column - Floating Action Card */}
        <div className='w-full md:w-[40%] lg:w-[32%] sticky top-28 z-20 shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-100'>
          <div className="bg-slate-900 relative group aspect-video flex items-center justify-center">
            {playerData ? (
              <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full h-full absolute inset-0' className="w-full h-full" />
            ) : (
              <>
                <img src={courseData.courseThumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white opacity-90 drop-shadow-lg" />
                </div>
              </>
            )}
          </div>

          <div className='p-6 md:p-8'>
            <div className='flex items-center gap-3'>
              <span className='text-4xl font-extrabold text-gray-900'>
                {currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
              </span>
              {courseData.discount > 0 && (
                <div className="flex flex-col">
                  <span className='text-lg font-medium text-gray-400 line-through'>{currency}{courseData.coursePrice}</span>
                  <span className='text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded'>{courseData.discount}% OFF</span>
                </div>
              )}
            </div>

            <button
              onClick={enrollCourse}
              className={`mt-6 w-full py-4 text-lg rounded-xl font-bold transition-all shadow-md active:scale-[0.98] ${isAlreadyEnrolled
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white'
                }`}
            >
              {isAlreadyEnrolled ? "Go to Course" : "Enroll Now"}
            </button>

            <p className='text-xs text-center text-gray-500 mt-4 mb-6'>30-Day Money-Back Guarantee</p>

            <div className='pt-6 border-t border-gray-100'>
              <p className='text-lg font-bold text-gray-900 mb-4'>This course includes:</p>

              <ul className='space-y-3'>
                <li className='flex items-center gap-3 text-sm text-gray-600'>
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{calculateCourseDuration(courseData)} on-demand video</span>
                </li>
                <li className='flex items-center gap-3 text-sm text-gray-600'>
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>{calculateNoOfLectures(courseData)} engaging lessons</span>
                </li>
                <li className='flex items-center gap-3 text-sm text-gray-600'>
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Active community learning</span>
                </li>
                <li className='flex items-center gap-3 text-sm text-gray-600'>
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Certificate of completion</span>
                </li>
                <li className='flex items-center gap-3 text-sm text-gray-600'>
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Lifetime access with free updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : <div className="min-h-screen flex items-center justify-center"><Loading /></div>
}

export default CourseDetails

