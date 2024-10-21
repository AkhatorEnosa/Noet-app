/* eslint-disable react/prop-types */

const ColorPallete = ({show, addBackground}) => {
  return (
    <div className={show ? "absolute flex items-center justify-center gap-2 z-50" : "hidden"}>
        <div className="relative w-5 h-5 flex justify-center items-center rounded-full bg-transparent border-[1px] border-black cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-primary cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-secondary cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-neutral cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-success cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-error cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-info cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-warning cursor-pointer" onClick={addBackground}></div>
    </div>
  )
}

export default ColorPallete