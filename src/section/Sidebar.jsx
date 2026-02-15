import { useState } from "react";
import { motion } from "framer-motion";
import Logo from '../assets/logo.webp'
import SidebarListItem from "../components/SidebarListItem";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const Sidebar = () => {
  const [miniSidebar, setMiniSidebar] = useState(false);
  
  const LINKITEMS = [
    { 
        label: 'Requested Collab', 
        icon: <PersonAddRoundedIcon fontSize="small" /> 
    },
    { 
        label: 'Collab Request', 
        icon: <GroupAddRoundedIcon fontSize="small" /> 
    }
  ]
  
  return (
    <motion.section
      className={`fixed flex flex-col h-screen py-10 bg-white text-black gap-10 left-0 top-0 shadow-lg z-[100]`}>
      <div className={`w-full h-fit flex justify-center items-center ${miniSidebar ? "left-0 opacity-100" : "-left-[100px] opacity-0"} transition-all duration-300`}>
        <img src={Logo} alt="website_logo" className={`${miniSidebar ? "w-28 md:w-32" : "w-0"} transition-all duraiton-300`}/>
      </div>
      <div className={`flex flex-col mt-0 divide-y-[1px] divide-gray-200 border-t-[1px] border-b-[1px] border-gray-200`}>
        {LINKITEMS.map((item) => (
            <SidebarListItem 
                key={item}
                title={item.label}
                icon={item.icon}
                miniSidebar={miniSidebar}
            />
        ))}
      </div>
      <div className={`absolute flex justify-end w-full h-fit bottom-5 px-5 text-xl`} onClick={() => setMiniSidebar(!miniSidebar)}>
        <i className={`absolute bottom-20 -right-5 flex text-gray-500 ${miniSidebar ? "rotate-180" : "rotate-0"} justify-center items-center size-8 rounded-full bg-white shadow transition-all duration-300 cursor-pointer`}><ChevronRightRoundedIcon /></i>
      </div>
    </motion.section>
  )
}

export default Sidebar