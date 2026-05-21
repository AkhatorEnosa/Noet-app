/* eslint-disable react/prop-types */

import { useSelector } from "react-redux"
import Logo from '../assets/logo.webp'
import LogoDark from '../assets/logo-dark.webp'
import useSignOut from "../hooks/useSignOut"
import { useEffect, useState } from "react"
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, isLoading } = useSelector(state => (state.app))
  const {mutate} = useSignOut()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const [name, setName] = useState("")
  const [imgUrl, setImgUrl] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const changeNavBarOnScroll = () => {
    const scrollThreshold = 50;

    if (window.scrollY >= scrollThreshold) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false)
    }
  }

  useEffect(() => {
    setName(user?.identities[0].identity_data.name)
    setImgUrl(user?.identities[0].identity_data.avatar_url)
    // console.log(user?.identities[0].identity_data);
  }, [user?.identities])

  useEffect(() => {
    window.addEventListener('scroll', changeNavBarOnScroll);

    return () => {
      window.removeEventListener('scroll', changeNavBarOnScroll);
    };
  }, []);
  
  

  const handleSignOut = async() => {
      mutate()
  }

    if(user !== null) return (
      <section className={`top-0 w-full flex justify-between items-center px-3 md:px-20 py-3 md:py-5 ${isScrolled && (isDark ? 'bg-dark-surface shadow-lg' : 'bg-white shadow')} sticky text-sm z-[62] duration-150 ease-in-out ${isDark ? 'text-dark-text' : ''}`}>
        <img src={Logo} alt="website_logo" className="w-28 md:w-32 dark:hidden" />
        <img src={LogoDark} alt="website_logo" className="w-28 md:w-32 hidden dark:block" />

        <div className="flex gap-3">
          {user !== null && 
          <div className="relative w-fit flex justify-end items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`w-10 p-2 flex justify-center items-center rounded-full transition-all duration-200 ${isDark ? 'bg-dark-border hover:bg-dark-border/80 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <LightModeRoundedIcon sx={{ fontSize: 20 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 20 }} />}
            </button>

            <div className={`flex w-full gap-2 justify-center items-center p-2 md:pl-2 md:pr-5 py-2 rounded-full cursor-pointer z-50 ${isDark ? 'bg-dark-border hover:bg-dark-border/80' : 'bg-gray-200'}`} onClick={() => setShowLogout(prev => !prev)}>
              <img src={imgUrl} alt={"Your username profile pic"} className={`w-8 h-8 rounded-full border-gray-300 border-[1px] ${isLoading && "animate-pulse"}`}/>
              <p className={`hidden md:block line-clamp-1 ${isDark ? 'text-dark-text' : ''}`}>{name}</p>
            </div>
            {/* <div className={`absolute ${!showLogout ? "scale-0" : "scale-100"} top-14 right-0 sm:left-0 text-xs bg-white shadow-lg border-[0.2px] border-black/50 rounded-md overflow-hidden duration-300 transition-all z-[70]`}>
                <ul>
                  <li className="flex justify-center items-center gap-5 hover:bg-gray-100 p-2 cursor-pointer duration-300 transition-all"
                    onClick={() => handleSignOut()}
                    disabled={isLoading}
                  >
                    { isLoading ?
                    <span className="loading loading-spinner loading-sm"></span> : 
                    <><LogoutRoundedIcon sx={{ fontSize: "18px" }} /> Logout</>
                    }
                  </li>
                </ul>
            </div> */}
            
            <div className={showLogout ? "fixed w-full h-full top-0 left-0 z-[65]" : "hidden"} onClick={() => setShowLogout(false)}></div>
              
            <button className={`absolute right-0 sm:left-0 ${showLogout ? "top-14 opacity-100 scale-100" : "top-0 opacity-0 scale-0"} w-fit sm:w-full flex justify-center items-center px-4 py-3 rounded-full gap-3 active:shadow-lg ${isLoading ? "bg-gray-500" : "bg-[#114f60] hover:bg-[#255f6f] dark:bg-[#2d7a8a] dark:hover:bg-[#3b8a9e]"} text-white z-[70] transition-all duration-200`} onClick={handleSignOut} disabled={isLoading}>
              {/* {isLoading ? 
                <div className="flex gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                </div> :  */}
                <p className="flex gap-2 items-center justify-center text-xs"><LogoutRoundedIcon sx={{ fontSize: "18px" }}/><span className="block">Logout</span></p>
              {/* } */}
           </button>
          </div>}
        </div>
      </section>
    )
}

export default Navbar