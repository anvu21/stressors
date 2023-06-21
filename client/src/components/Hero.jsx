import React from 'react'
import {motion} from 'framer-motion';
import {logo, menu,close} from '../assets'

import {styles} from '../style';
//import { ComputersCanvas } from './canvas';
const Hero = () => {
  return (

    <header className=' w-full flex justify-center items-center flex-col'>
    

    <h1 className='gap-4 mt-5 text-5xl font-extrabold leading-[1.15] text-black sm:text-6xl text-center'>
      Cover Letter Writter with <br className='max-md:hidden' />
      <span className='bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent'>OpenAI GPT</span>
    </h1>
    <h2 className='mt-5 text-lg text-gray-600 sm:text-xl text-center max-w-2xl'>
      Simplify your job hunt with ChatGPT. 
       With just a few clicks, you can create a compelling cover 
       letter that helps you stand out in today's competitive job market.
    </h2>
  </header>

    


  )
}

export default Hero