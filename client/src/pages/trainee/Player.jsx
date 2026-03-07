import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from "humanize-duration"
import YouTube from 'react-youtube'
import Footer from '../../components/trainee/Footer'
import Reating from '../../components/trainee/Reating'
import { toast } from 'react-toastify'
import Loading from '../../components/trainee/Loading'
import axios from 'axios'
import { ShieldCheck, PlayCircle, ChevronDown, ChevronUp, CheckCircle, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Player = () => {

  const { enrolledCourses, calculateChapterTime, fetchUserEnrolledCourses, backendUrl,
    userData, getToken, } = useContext(AppContext)
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({ 0: true })
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course)
        // Automatically set first lecture as player data if not set
        if (!playerData && course.courseContent?.[0]?.chapterContent?.[0]) {
          const firstLecture = course.courseContent[0].chapterContent[0];
          if (firstLecture.lectureUrl) {
            setPlayerData({
              ...firstLecture, chapter: 1, lecture: 1
            })
          }
        }

        course.ratings?.forEach((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating)
          }
        })
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSection((prev) => (
      { ...prev, [index]: !prev[index] }
    ))
  }

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData()
    }
  }, [enrolledCourses])

  const markLectureAsComplete = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + "/api/user/get-course-progress",
        { courseId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setProgressData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRating = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + "/api/user/add-user-rating",
        { courseId, rating }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getCourseProgress()
  }, [])

  return courseData ? (
    <div className='flex flex-col min-h-screen bg-slate-950 text-slate-200'>
      {/* Navbar for Player */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-md">
        <h1 className="font-bold text-white truncate max-w-2xl">{courseData.courseTitle}</h1>
        <button
          className="lg:hidden p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <X /> : <Menu />}
        </button>
      </div>

      <div className='flex flex-1 relative overflow-hidden'>

        {/* Main Content Area (Video Player) */}
        <div className='flex-1 flex flex-col items-center bg-black overflow-y-auto scrollbar-hide'>
          <div className="w-full max-w-6xl w-full aspect-video bg-black relative">
            {playerData ? (
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                opts={{ playerVars: { autoplay: 1, rel: 0, modestbranding: 1 } }}
                iframeClassName='absolute top-0 left-0 w-full h-full'
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={courseData.courseThumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-30" />
                <PlayCircle className="absolute w-20 h-20 text-white opacity-80" />
              </div>
            )}
          </div>

          {/* Below Video Details */}
          {playerData && (
            <div className="w-full max-w-6xl p-6 bg-slate-900/50 mt-4 rounded-xl border border-slate-800 mb-8 mx-4">
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <div>
                  <h2 className='text-2xl font-bold text-white'>
                    {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">{courseData.educator.name}</p>
                </div>

                <button
                  onClick={() => markLectureAsComplete(playerData.lectureId)}
                  className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 ${progressData && progressData.lectureCompleted.includes(playerData.lectureId)
                      ? "bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-slate-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark as Complete"}
                </button>
              </div>

              <div className='flex items-center gap-4 mt-8 pt-6 border-t border-slate-800'>
                <h3 className='text-lg font-medium text-slate-300'>Rate this course:</h3>
                <div className="bg-slate-800 px-4 py-2 rounded-lg">
                  <Reating initialRating={initialRating} onRate={handleRating} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Playlist */}
        <AnimatePresence>
          {(showSidebar || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed lg:static inset-y-0 right-0 z-20 w-80 lg:w-96 bg-slate-900 border-l border-slate-800 overflow-y-auto ${!showSidebar && "hidden lg:block"} pt-16 lg:pt-0`}
            >
              <div className="p-5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 backdrop-blur">
                <h2 className='text-lg font-bold text-white flex items-center gap-2'>
                  Course Content
                </h2>
              </div>

              <div className='p-3 space-y-2'>
                {courseData && courseData.courseContent.map((chapter, index) => (
                  <div key={index} className='border border-slate-700/50 bg-slate-800/50 rounded-lg overflow-hidden'>
                    <div
                      className='flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-700/50 transition-colors'
                      onClick={() => toggleSection(index)}
                    >
                      <div className='flex items-center gap-2 w-3/4'>
                        {openSection[index] ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                        <p className='font-semibold text-sm text-slate-200 truncate'>{chapter.chapterTitle}</p>
                      </div>
                      <p className='text-xs font-medium text-slate-400'>{chapter.chapterContent.length} / {calculateChapterTime(chapter)}</p>
                    </div>

                    <AnimatePresence>
                      {openSection[index] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-900/50"
                        >
                          <ul className='py-2 px-2'>
                            {chapter.chapterContent.map((lecture, i) => {
                              const isCompleted = progressData?.lectureCompleted?.includes(lecture.lectureId);
                              const isCurrentStr = playerData?.lectureId === lecture.lectureId ? "bg-blue-900/40 border border-blue-800/50" : "hover:bg-slate-800 border border-transparent";

                              return (
                                <li
                                  key={i}
                                  className={`flex flex-col gap-1 p-2.5 rounded-md cursor-pointer transition-all mb-1 ${isCurrentStr}`}
                                  onClick={() => lecture.lectureUrl && setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                                >
                                  <div className='flex items-start gap-3 w-full'>
                                    {isCompleted ? (
                                      <CheckCircle className='w-4 h-4 mt-0.5 text-emerald-500 shrink-0' />
                                    ) : (
                                      <PlayCircle className='w-4 h-4 mt-0.5 text-slate-500 shrink-0' />
                                    )}
                                    <div className='flex flex-col w-full'>
                                      <span className={`text-sm ${playerData?.lectureId === lecture.lectureId ? 'text-blue-100 font-semibold' : 'text-slate-300'}`}>
                                        {i + 1}. {lecture.lectureTitle}
                                      </span>
                                      <div className='flex items-center justify-between w-full mt-1.5'>
                                        <span className="text-xs text-slate-500">{lecture.lectureTime || "Video"}</span>
                                        <span className='text-xs font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded'>
                                          {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["m"], round: true })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {showSidebar && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-10 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </AnimatePresence>
    </div>
  ) : <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loading /></div>
}

export default Player
