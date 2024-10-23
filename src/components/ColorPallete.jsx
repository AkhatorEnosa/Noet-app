/* eslint-disable react/prop-types */

const ColorPallete = ({show, addBackground}) => {
  return (
    <div className={show ? "absolute flex items-center justify-center bottom-24 md:top-0 gap-2 z-50" : "hidden"}>
      <div className="relative w-8 h-8 flex justify-center items-center rounded-full bg-white border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
      <div className="w-8 h-8 rounded-full bg-green-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
      <div className="w-8 h-8 rounded-full bg-red-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
      <div className="w-8 h-8 rounded-full bg-slate-300 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
      <div className="w-8 h-8 rounded-full bg-yellow-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
      <div className="w-8 h-8 rounded-full bg-blue-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
    </div>
  )
}

export default ColorPallete