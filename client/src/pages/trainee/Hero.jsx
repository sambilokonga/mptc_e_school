import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'
import { motion } from 'framer-motion'

const Hero = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div
      className='relative flex items-center flex-col justify-center w-full min-h-[550px] md:pt-40 pt-28 px-7 md:px-0 text-center overflow-hidden bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${assets.welder_hero_bg})` }}
    >
      {/* Black/Blur Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className='md:text-6xl text-4xl font-extrabold text-white tracking-tight leading-tight'>
            Empower your future with courses designed to <br className="hidden md:block" />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 relative inline-block'>
              fit your choice.
              <img src={assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-5 right-0 w-full h-auto z-[-1] opacity-50' />
            </span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="md:block hidden text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
          </p>
          <p className='md:hidden text-lg text-gray-200 max-w-sm mx-auto'>
            We bring together world-class instructors to help you achieve your personal and professional goals.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto pt-4 mb-4">
          <SearchBar />
        </motion.div>
        <motion.div>
          <div className='w-full max-w-2xl mx-auto pt-4'>
          <SearchBar />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero
