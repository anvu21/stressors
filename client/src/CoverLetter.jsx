import {BrowserRouter} from 'react-router-dom';

import {About, Contact, Experience, Feedbacks, Hero,Navbar,Tech,Works,Input,StarsCanvas} from './components'

const  CoverLetter=() =>{

  return (
      <div className="min-h-screen relative z-0 bg-main">
          <div className="">
            <div style={{ marginTop: '60px' }}>

            </div>
            <Hero/>
            <Input/>
       
            </div>
      </div>

)
}

export default CoverLetter;
