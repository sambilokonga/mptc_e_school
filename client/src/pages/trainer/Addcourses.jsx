import React, { useContext, useEffect, useRef, useState } from 'react'
import uniqid from "uniqid"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { UploadCloud, PlusCircle, Trash2, ChevronDown, CheckCircle, Save, Video, LayoutList, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Addcourses = () => {

  const { backendUrl, getToken } = useContext(AppContext)
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState(
    {
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    }
  )

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      )
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1)
          }
          return chapter
        })
      );
    }
  }

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid()
          }
          chapter.chapterContent.push(newLecture)
        }
        return chapter
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!image) {
        return toast.error("Please upload a course thumbnail")
      }

      const courseDescription = quillRef.current.root.innerHTML;
      if (courseDescription === "<p><br></p>" || !courseDescription) {
        return toast.error("Please add a course description")
      }

      const courseData = {
        courseTitle,
        courseDescription,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append("courseData", JSON.stringify(courseData))
      formData.append("image", image)

      const token = await getToken()
      const toastId = toast.loading("Saving course...")

      const { data } = await axios.post(backendUrl + "/api/educator/add-course", formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (data.success) {
        toast.update(toastId, { render: data.message, type: "success", isLoading: false, autoClose: 3000 })
        setCourseTitle("")
        quillRef.current.root.innerHTML = ""
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
      } else {
        toast.update(toastId, { render: data.message, type: "error", isLoading: false, autoClose: 3000 })
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write a detailed description for your course...",
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        }
      })
    }
  }, [])

  return (
    <div className='min-h-[calc(100vh-73px)] p-6 md:p-10 bg-gray-50/50 w-full overflow-y-auto'>
      <div className='max-w-4xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className='text-3xl font-extrabold text-gray-900'>Create New Course</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to publish a new course.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className='space-y-8 pb-20'>

          {/* Basic Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-4">
              <BookOpen className="w-5 h-5 text-blue-500" /> Basic Information
            </h2>

            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-700'>Course Title <span className="text-red-500">*</span></label>
              <input
                onChange={e => setCourseTitle(e.target.value)}
                value={courseTitle}
                required
                className='outline-none py-3 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/50 focus:bg-white'
                type="text"
                placeholder='e.g., Complete Web Development Bootcamp'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-700'>Course Description <span className="text-red-500">*</span></label>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:border-b [&_.ql-container]:border-none [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-base">
                <div ref={editorRef}></div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-gray-700'>Course Price (ETB) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">ETB</span>
                  <input
                    onChange={e => setCoursePrice(e.target.value)}
                    value={coursePrice}
                    required
                    type="number"
                    placeholder='0.00'
                    min={0}
                    className='outline-none py-3 pl-4 pr-4 w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/50 focus:bg-white'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-gray-700'>Discount (%)</label>
                <div className="relative">
                  <input
                    onChange={e => setDiscount(e.target.value)}
                    value={discount}
                    type="number"
                    placeholder='0'
                    min={0}
                    max={100}
                    className='outline-none py-3 pl-4 pr-8 w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/50 focus:bg-white'
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-700'>Course Thumbnail <span className="text-red-500">*</span></label>
              <label htmlFor="thumbnailImage" className='flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer group'>
                {image ? (
                  <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden shadow-sm">
                    <img src={URL.createObjectURL(image)} alt="Preview" className='w-full h-full object-cover' />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium flex items-center gap-2"><UploadCloud className="w-5 h-5" /> Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-gray-700">Click to upload thumbnail</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  id="thumbnailImage"
                  onChange={e => setImage(e.target.files[0])}
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </motion.div>

          {/* Curriculum Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-indigo-500" /> Course Curriculum
              </h2>
              <button
                type="button"
                onClick={() => handleChapter("add")}
                className='flex items-center gap-2 text-sm font-semibold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors'
              >
                <PlusCircle className="w-4 h-4" /> Add Chapter
              </button>
            </div>

            <div className="space-y-4">
              {chapters.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <LayoutList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No chapters added yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Start by adding your first chapter to build the curriculum.</p>
                </div>
              ) : (
                chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.chapterId} className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
                    <div className={`flex items-center justify-between p-4 ${!chapter.collapsed && chapter.chapterContent.length > 0 ? "border-b border-gray-100 bg-gray-50/50" : "bg-white"} transition-colors`}>
                      <div className='flex items-center cursor-pointer select-none group' onClick={() => handleChapter("toggle", chapter.chapterId)}>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 font-bold text-sm">
                          {chapterIndex + 1}
                        </div>
                        <span className='font-bold text-gray-800 group-hover:text-indigo-600 transition-colors'>{chapter.chapterTitle}</span>
                        <ChevronDown className={`ml-3 w-5 h-5 text-gray-400 transition-transform duration-300 ${chapter.collapsed ? "-rotate-90" : ""}`} />
                      </div>

                      <div className="flex items-center gap-4">
                        <span className='text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md'>{chapter.chapterContent.length} Lectures</span>
                        <button
                          type="button"
                          onClick={() => handleChapter("remove", chapter.chapterId)}
                          className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                          title="Remove Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {!chapter.collapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className='p-4 bg-gray-50/30'
                        >
                          {chapter.chapterContent.map((lecture, lectureIndex) => (
                            <div key={lecture.lectureId} className='flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-lg mb-3 shadow-sm hover:border-gray-300 transition-colors'>
                              <div className="flex items-center gap-3">
                                <Video className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-700 text-sm">{lectureIndex + 1}. {lecture.lectureTitle}</span>
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{lecture.lectureDuration} mins</span>
                                {lecture.isPreviewFree && (
                                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Free</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <a href={lecture.lectureUrl} target='_blank' rel="noreferrer" className='text-sm font-medium text-blue-600 hover:underline'>Preview Link</a>
                                <button
                                  type="button"
                                  onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)}
                                  className='p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors'
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleLecture("add", chapter.chapterId)}
                            className='flex items-center gap-2 justify-center w-full mt-2 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all'
                          >
                            <PlusCircle className="w-4 h-4" /> Add Lecture
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Sticky Submit Button */}
          <div className="sticky bottom-6 z-10 flex justify-end">
            <button
              type='submit'
              className='bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2 w-full md:w-auto justify-center'
            >
              <Save className="w-5 h-5" /> Publish Course
            </button>
          </div>
        </form>
      </div>

      {/* Add Lecture Modal */}
      <AnimatePresence>
        {showPopup && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowPopup(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='bg-white w-full max-w-md rounded-2xl shadow-xl relative z-10 overflow-hidden'
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'><Video className="w-5 h-5 text-blue-600" /> Add New Lecture</h2>
                <button type="button" onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600">
                  <ChevronDown className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className='flex flex-col gap-1.5'>
                  <label className="text-sm font-semibold text-gray-700">Lecture Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Introduction to React"
                    className='outline-none py-2.5 px-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                    value={lectureDetails.lectureTitle}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-1.5'>
                    <label className="text-sm font-semibold text-gray-700">Duration <span className="text-gray-400 font-normal">(mins)</span></label>
                    <input
                      type="number"
                      placeholder="e.g., 15"
                      min={1}
                      className='outline-none py-2.5 px-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                      onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                      value={lectureDetails.lectureDuration}
                    />
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <label className="text-sm font-semibold text-gray-700 mt-7 hidden sm:block"></label>
                    <label className='flex items-center gap-3 py-2.5 px-3 mt-0 sm:mt-7 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 select-none'>
                      <input
                        type="checkbox"
                        className='w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                        onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                        checked={lectureDetails.isPreviewFree}
                      />
                      <span className="text-sm font-medium text-gray-700">Free Preview</span>
                    </label>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className="text-sm font-semibold text-gray-700">Video URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    className='outline-none py-2.5 px-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm'
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                    value={lectureDetails.lectureUrl}
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type='button'
                  className='px-5 py-2 font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors'
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 w-32 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
                  onClick={addLecture}
                  disabled={!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl}
                >
                  <PlusCircle className="w-4 h-4" /> Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Addcourses
