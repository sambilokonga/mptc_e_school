import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'
import { motion } from 'framer-motion'

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext)

  return (
    <div className='py-24 md:px-40 px-8 w-full bg-gray-50/50'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className='text-4xl font-bold text-gray-900'>Learn from the best</h2>
        <p className='text-lg text-gray-500 mt-4 leading-relaxed'>
          Discover our top-rated courses across various fields. From technology and design to business and professional skills, our programs are designed to help you succeed.
        </p>
      </motion.div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-0 mt-16 mb-12 gap-8'>
        {allCourses.slice(0, 4).map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex justify-center mt-12"
      >
        <Link
          to={"/course-list"}
          onClick={() => scrollTo(0, 0)}
          className='text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold px-10 py-3 rounded-full shadow-sm hover:shadow-md'
        >
          Show all courses
        </Link>
      </motion.div>
    </div>
  )
}

export default CoursesSection
