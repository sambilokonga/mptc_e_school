import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

const CourseCard = ({ course }) => {

  const { currency, calculateRating } = useContext(AppContext)
  const rating = calculateRating(course)

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className='group flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl h-full'
    >
      <div className="overflow-hidden relative">
        <img
          className='w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out'
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
      </div>

      <div className='p-5 flex flex-col flex-grow text-left'>
        <h3 className='text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-300'>
          {course.courseTitle}
        </h3>
        <p className='text-gray-500 text-sm mt-2 flex-grow font-medium'>{course.educator.name}</p>

        <div className='flex items-center space-x-2 mt-4'>
          <p className="font-bold text-amber-500">{rating}</p>
          <div className='flex space-x-0.5'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
              />
            ))}
          </div>
          <p className='text-gray-400 text-sm'>({course.ratings?.length || 0})</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className='text-xl font-extrabold text-blue-600'>
            {currency} {(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}
          </p>
          {course.discount > 0 && (
            <p className='text-sm text-gray-400 line-through'>
              {currency} {course.coursePrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
