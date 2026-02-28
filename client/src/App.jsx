import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/trainee/Home'
import CourseDetails from './pages/trainee/CourseDetails'
import CoursesList from './pages/trainee/CoursesList'
import MyEnrollements from './pages/trainee/MyEnrollements'
import Player from './pages/trainee/Player'
import Loading from './components/trainee/Loading'
import Trainer from './pages/trainer/Trainer'
import Dashboard from './pages/trainer/Dashboard'
import StudentsEnrolled from './pages/trainer/StudentsEnrolled'
import MyCourses from './pages/trainer/MyCourses'
import Addcourses from './pages/trainer/Addcourses'
import Navbar from './components/trainee/Navbar'
import "quill/dist/quill.snow.css";


const App = () => {
  const isEducatorRoute = useMatch("/trainer/*")
  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollements />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />
        <Route path='/trainer' element={<Trainer />}>
          <Route path='/trainer' element={<Dashboard />} />
          <Route path='add-course' element={<Addcourses />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
