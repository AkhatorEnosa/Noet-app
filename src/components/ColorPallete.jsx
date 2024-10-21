/* eslint-disable react/prop-types */
const ColorPallete = ({show, addBackground}) => {
  return (
    <div className={show ? "absolute flex items-center justify-center gap-2 z-50" : "hidden"}>
        <div className="w-5 h-5 rounded-full bg-primary/80 cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-secondary/80 cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-neutral/80 cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-success/80 cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-error/80 cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-info/80 cursor-pointer" onClick={addBackground}></div>
        <div className="w-5 h-5 rounded-full bg-warning/80 cursor-pointer" onClick={addBackground}></div>
    </div>
  )
}

export default ColorPallete