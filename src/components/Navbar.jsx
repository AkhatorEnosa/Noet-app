/* eslint-disable react/prop-types */

import { useSelector } from "react-redux"
// import Logo from '../assets/logo.webp'
import useSignOut from "../hooks/useSignOut"
import {motion} from "framer-motion"
import { useEffect, useState } from "react"
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Navbar = ({ variant }) => {
  const { user, isLoading } = useSelector(state => (state.data))
  const {mutate} = useSignOut()

  const [name, setName] = useState("")
  const [imgUrl, setImgUrl] = useState("")

  useEffect(() => {
    setName(user?.identities[0].identity_data.name)
    setImgUrl(user?.identities[0].identity_data.avatar_url)
  }, [user?.identities])
  

  const handleSignOut = async() => {
      mutate()
  }

    if(user !== null) return (
      <div className={`w-full flex justify-between items-center px-3 md:px-20 py-3 md:py-5 shadow-md z-50 bg-white text-sm ${variant}`}>
        <h1 className="logo-nav">my<b>Noet</b></h1>

        <div className="flex gap-3">
          {user !== null && 
          <div className="flex justify-center items-center gap-5">
            <div className="w-[40%] sm:w-fit flex gap-2 justify-center items-center bg-gray-200 pl-2 pr-5 py-2 rounded-full">
              <img src={imgUrl} alt="" className="w-8 h-8 rounded-full border-gray-300 border-[1px]"/>
              <p className="line-clamp-1">{name}</p>
            </div>
            <motion.button
              // whileHover={{
              //   color: '#000',
              //   boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
              //   borderRadius: 0
              // }}
              // whileTap={{
              //   scale: 0.95,
              //   backgroundColor: 'rgba(0 0 0 1)'
              // }}
            className="flex justify-center items-center px-4 py-2 rounded-lg gap-3 active:shadow-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200" onClick={handleSignOut} disabled={isLoading}>
          {isLoading ? 
          <div className="flex gap-2">
            <span className="loading loading-spinner loading-sm"></span>
           </div> : <p className="flex gap-2 items-center justify-center text-xs"><LogoutRoundedIcon sx={{ fontSize: "18px" }}/><span className="hidden lg:block">Logout</span></p>}</motion.button>
          </div>}
        </div>
      </div>
    )
}

export default Navbar