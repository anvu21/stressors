import Hero from "./components2/Hero";
import Demo from "./components2/Demo";
import {BrowserRouter} from 'react-router-dom';


const Summary = () => {
  return (
    <div className="min-h-screen relative z-0 bg-main">
          <div className="">
            <div style={{ marginTop: '60px' }}>

            </div>
            <Hero />
            <Demo />      
            </div>


      </div>
  );
};

export default Summary;
