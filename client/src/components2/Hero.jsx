import React from "react";

import { logo } from "../assets";

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      

      <h1 className='gap-4 mt-5 text-5xl font-extrabold leading-[1.15] text-black sm:text-6xl text-center'>
        Summarize your Articles with <br className='max-md:hidden' />
        <span className='bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent'>OpenAI GPT-4</span>
      </h1>
      <h2 className='mt-5 text-lg text-gray-600 sm:text-xl text-center max-w-2xl'>
        Summarize your article with a simple click
      </h2>
    </header>
  );
};

export default Hero;
