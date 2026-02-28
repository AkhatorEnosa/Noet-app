import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, x: 400 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// eslint-disable-next-line react/prop-types
const Color= ({ themeColor, themeIcon, isActive }) => {
  return (
    <motion.span
        variants={variants}
        className={`w-8 h-8 flex justify-center items-center ${themeColor} ${isActive ? "scale-125 border-2" : ""} hover:scale-125 transition-all duration-150 rounded-full border-[1px] border-black cursor-pointer overflow-hidden`}
    >
        {/* Render the MUI Icon component directly */}
        <div className="flex items-center justify-center scale-75">
            {themeIcon}
        </div>
    </motion.span>
  )
}

export default Color