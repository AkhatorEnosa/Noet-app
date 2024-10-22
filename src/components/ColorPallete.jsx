/* eslint-disable react/prop-types */

const ColorPallete = ({show, addBackground}) => {
  return (
    <div className={show ? "absolute flex items-center justify-center gap-2 z-50" : "hidden"}>
        <div className="relative w-5 h-5 flex justify-center items-center rounded-full bg-transparent border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-green-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-red-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-slate-300 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-yellow-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-blue-100 border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
    </div>
  )
}

export default ColorPallete