import React from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const CallToAction = () => {
  return (
    <div className='w-full flex justify-center py-20 px-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='max-w-5xl w-full bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-12 md:p-20 text-center shadow-2xl relative overflow-hidden'
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className='text-3xl md:text-5xl text-white font-bold leading-tight max-w-2xl'>
            Learn anything, anytime, anywhere
          </h1>
          <p className='text-blue-100 text-lg md:text-xl mt-6 max-w-2xl'>
            Misrak Poly Technic College (MPTC) provides quality technical and vocational education that equips students with practical skills and knowledge for successful careers.
          </p>
          <div className='flex flex-col sm:flex-row items-center font-medium gap-4 mt-10'>
            <button className='px-10 py-4 w-full sm:w-auto rounded-full text-blue-600 bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-lg text-lg'>
              Get started
            </button>
            <button className='group px-10 py-4 w-full sm:w-auto rounded-full text-white bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 transition-all duration-200 flex justify-center items-center gap-2 text-lg backdrop-blur-sm'>
              Learn more <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CallToAction
