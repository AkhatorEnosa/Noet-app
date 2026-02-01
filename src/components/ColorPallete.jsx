/* eslint-disable react/prop-types */

const ColorPallete = ({show, addBackground, colorOption}) => {
  return (
    <div className={`absolute flex items-center justify-center bottom-24 md:top-0 ${show ? "scale-100 z-50" : "scale-0 translate-y-10 z-0"} transition-all duration-150 gap-3`}>
      <div className={`w-8 h-8 ${colorOption === "bg-white" && "scale-125 border-2"} hover:scale-125 transition-all duration-200 flex justify-center items-center rounded-full bg-white border-[1px] border-black cursor-pointer`} onClick={addBackground}></div>
      <div className={`w-8 h-8 ${colorOption === "bg-green-100" && "scale-125 border-2"} hover:scale-125 transition-all duration-200 rounded-full bg-green-100 border-[1px] border-black cursor-pointer`} onClick={addBackground}></div>
      <div className={`w-8 h-8 ${colorOption === "bg-red-100" && "scale-125 border-2"} hover:scale-125 transition-all duration-200 rounded-full bg-red-100 border-[1px] border-black cursor-pointer`} onClick={addBackground}></div>
      <div className={`w-8 h-8 ${colorOption === "bg-slate-300" && "scale-125 border-2"} hover:scale-125 transition-all duration-200 rounded-full bg-slate-300 border-[1px] border-black cursor-pointer`} onClick={addBackground}></div>
      <div className={`w-8 h-8 ${colorOption === "bg-yellow-100" && "scale-125 border-2"} hover:scale-125 transition-all duration-200 rounded-full bg-yellow-100 border-[1px] border-black cursor-pointer`} onClick={addBackground}></div>
      <div className={`w-8 h-8 ${colorOption === "bg-blue-100" && "scale-125 border-2"} hover:scale-125 transition-all duration-200 rounded-full bg-blue-100 border-[1px] border-black cursor-pointer`} onClick={addBackground}></div>
      <div className={`w-8 h-8 ${colorOption === "bg-purple-100" && "scale-125 border-2"} hover:scale-125 transition-all duration-200 rounded-full bg-purple-100 border-[1px] border-black cursor-pointer`} onClick={addBackground}></div>
    </div>
  )
}

export default ColorPallete