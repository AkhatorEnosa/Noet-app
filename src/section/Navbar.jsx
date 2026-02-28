/* eslint-disable react/prop-types */

import { useSelector } from "react-redux"
import Logo from '../assets/logo.webp'
import useSignOut from "../hooks/useSignOut"
import { useEffect, useState } from "react"
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Navbar = () => {
  const { user, isLoading } = useSelector(state => (state.app))
  const {mutate} = useSignOut()

  const [name, setName] = useState("")
  const [imgUrl, setImgUrl] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const changeNavBarOnScroll = () => {
    const scrollThreshold = 250;

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
      <section className={`top-0 w-full flex justify-between items-center px-3 md:px-20 py-3 md:py-5 ${isScrolled && 'bg-white sticky shadow'} text-sm z-[62] duration-150 ease-in-out`}>
        <img src={Logo} alt="website_logo" className="w-28 md:w-32"/>

        <div className="flex gap-3">
          {user !== null && 
          <div className="relative w-fit flex justify-end items-center gap-5">
            <div className="flex w-full gap-2 justify-center items-center bg-gray-200 p-2 md:pl-2 md:pr-5 py-2 rounded-full cursor-pointer z-50" onClick={() => setShowLogout(prev => !prev)}>
              <img src={imgUrl} alt={"Your username profile pic"} className={`w-8 h-8 rounded-full border-gray-300 border-[1px] ${isLoading && "animate-spin"}`}/>
              <p className="hidden md:block line-clamp-1">{name}</p>
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
              
            <button className={`absolute right-0 sm:left-0 ${showLogout ? "top-14 opacity-100 scale-100" : "top-0 opacity-0 scale-0"} w-fit sm:w-full flex justify-center items-center px-4 py-3 rounded-full gap-3 active:shadow-lg ${isLoading ? "bg-gray-500" : "bg-[#114f60] hover:bg-[#255f6f]"} text-white z-[70] transition-all duration-200`} onClick={handleSignOut} disabled={isLoading}>
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