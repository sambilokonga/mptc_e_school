import React from 'react'
import Hero from '../../components/trainee/Hero'
import Companies from '../../components/trainee/Companies'
import CoursesSection from '../../components/trainee/CoursesSection'
import TestimonialSection from '../../components/trainee/TestimonialsSection'
import CallToAction from '../../components/trainee/CallToAction'
import Footer from '../../components/trainee/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero />
      <Companies />
      <CoursesSection />
      <TestimonialSection />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home
