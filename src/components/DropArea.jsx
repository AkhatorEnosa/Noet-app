/* eslint-disable react/prop-types */
import { useState } from "react"

const DropArea = ({handleDrop}) => {
    const [showDrop, setShowDrop] = useState(false)
  return (
    <div 
      className={showDrop ? "w-full p-1 bg-black rounded-full aspect-auto" : "opacity-0 p-1 w-full"} 
      onDragEnter={() => setShowDrop(true)} 
      onDragLeave={() => setShowDrop(false)}
      onDrop={() => {
        handleDrop(),
        setShowDrop(false)
      }}
      onDragOver={(e) => e.preventDefault()}
      ></div>
  )
}

export default DropArea