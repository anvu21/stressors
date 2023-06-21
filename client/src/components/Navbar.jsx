import React, {useEffect,useState} from 'react'
import {Link, useLocation} from 'react-router-dom';

import {styles} from '../style';
import { navLinks } from '../constants';
import {logo, menu,close} from '../assets'

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`${styles.paddingX} w-full flex item-center py-5 fixed top-0 z-20 bg-blue-500 `

      }
>
      <div className='w-full flex justify-between item-center max-w-7x1 mx-auto'>
        <Link to="/"
          className = "flex items-center gap-2"
          onClick= {()=> {
            setActive("");
            window.scrollTo(0, 0);
          }}
          >

            <img src={logo} alt="logo"
            className="w-9 h9 object-contain"/>
            <p className="text-white text-[18px]
            font-bold cursor-pointer flex"> Anh Vu<span
            className='sm:block hidden'> |Eckardt Project 
                 </span></p>
          </Link>
    <Link to={isHomePage ? '/summary' : '/'}
      className="list-none hidden sm:flex flex-row gap-10"
      onClick={() => {
        setActive('');
        window.scrollTo(0, 0);
      }}>
      <p className={
        `${active === "a" ? 'text-black' : 'text-white'}
        hover:text-black text-[18px] font-medium cursor-pointer`
      }>
        {isHomePage ? 'Summary' : 'Cover Letter'}
      </p>
    </Link>
          
          </div>
        

      

</nav>
      


  )
}

export default Navbar