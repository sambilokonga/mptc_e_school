import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Footer from '../../components/trainee/Footer'
import SearchBar from '../../components/trainee/SearchBar'
import CourseCard from '../../components/trainee/CourseCard'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

const CoursesList = () => {

    const { navigate, allCourses } = useContext(AppContext)
    const { input } = useParams()
    const [filteredcourse, setFilteredcourse] = useState([])

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice()

            input ?
                setFilteredcourse(
                    tempCourses.filter(
                        item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                    )
                )
                : setFilteredcourse(tempCourses)
        }
    }, [allCourses, input])

    return (
        <div className='bg-gray-50 min-h-screen'>
            {/* Header Section */}
            <div className='relative w-full bg-gradient-to-br from-indigo-900 to-blue-800 pt-24 pb-16 px-8 md:px-36 text-white overflow-hidden'>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className='relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between w-full'>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='text-4xl md:text-5xl font-extrabold tracking-tight'
                        >
                            Course List
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className='text-blue-200 mt-2 font-medium'
                        >
                            <span className='hover:text-white cursor-pointer transition-colors duration-200' onClick={() => navigate("/")}>Home</span>
                            <span className="mx-2">/</span>
                            <span className="text-white">Course List</span>
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full md:w-auto"
                    >
                        <SearchBar data={input} />
                    </motion.div>
                </div>
            </div>

            <div className='px-8 md:px-36 max-w-7xl mx-auto pb-20'>
                {/* Active Filter Tags */}
                {input && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mt-8 text-gray-700 font-medium'
                    >
                        <span className="text-gray-500 text-sm">Showing results for:</span>
                        <span className="text-blue-600">"{input}"</span>
                        <button
                            className='ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500 hover:text-red-500'
                            onClick={() => navigate("/course-list")}
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}

                {/* Course Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8 gap-6'>
                    {filteredcourse.length > 0 ? (
                        filteredcourse.map((course, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <h3 className="text-2xl font-bold text-gray-800">No courses found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CoursesList
