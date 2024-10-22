import { useRef, useState } from "react"
import useCreateTodo from "../hooks/useCreateNote"
import useNotes from "../hooks/useNotes"
import Todo from "../components/Todo"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useSelector } from "react-redux";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ColorPallete from "../components/ColorPallete";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const todos = useSelector((state) => state.data.todos)
  let inputRef = useRef('')

  const {error, isLoading, fetchStatus} = useNotes()
  const {mutate} = useCreateTodo()

  const [wordCount, setWordCount] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState("")

  const handleTodoAdd = (e) => {
    e.preventDefault()
    // findLink(inputRef.current.value)
    if(inputRef.current.value.trim() !== "") {
      mutate({data_value: inputRef.current.value.toString(), bg_color: colorOptionValue})
      setShowInput(false)
    } else {
      inputRef.current.focus();
      setWordCount(0)
    }
      inputRef.current.value = ''
      setWordCount(0)
      setShowInput(false)
  }

  const clearInput = () => {
    setWordCount(0)
    inputRef.current.value = ''
  }

  const handleColorOption = (e) => {
    const getColorValue = (e.target.className).split(" ").filter((x) => /bg-/.test(x))[0]
    setColorOptionValue(getColorValue)
  }


  useGSAP(() =>{
    // const tl = gsap.timeline()
      gsap.to(".nav", {
        position: "sticky",
        top: "0px",
          scrollTrigger: {
            trigger: ".todo",
            start: "top top",
            ease: "elastic",
            scrub: true,duration: 0.5,
            toggleClass: "active",
            toggleActions: "play pause resume reset",
            onToggle: () => {
              ScrollTrigger.refresh()
            },
          }
        })
  })




  if(error) return  <h3>Error: {error}</h3>
  return (
    <div className="w-full flex flex-col gap-5 px-3 md:px-10 lg:px-20 py-10 justify-center items-center">


        {showInput && <form onSubmit={handleTodoAdd} className={`form relative ${colorOptionValue} gap-4 w-full md:w-[80%] lg:w-[70%] h-full p border justify-center items-center rounded-t-lg shadow-md`}>
          <div className="flex items-center justify-end top-2 right-2 px-2 pt-2">
            <button className={wordCount > 0 ? "z-20 text-black/70 hover:text-neutral transition-all duration-300": "hidden transition-all duration-300"} type="button" onClick={clearInput}><ClearRoundedIcon /></button>
          </div>
            <textarea type="text" ref={inputRef} onInput={()=> inputRef.current && setWordCount(inputRef.current.value.length)} className={wordCount < 1 ? `w-full outline-none resize-none p-4 bg-transparent text-base z-30 transition-all duration-300` : wordCount > 100 ? `w-full outline-none resize-none h-64 px-4 bg-transparent text-base z-30 transition-all duration-300` : `w-full outline-none resize-none px-4 bg-transparent text-lg h-auto z-30 transition-all duration-300`} placeholder="Write Noet..."/>

            <div className="w-full flex justify-center items-center py-4">
                <ColorPallete show={showColorPallete} addBackground={handleColorOption}/>
                {fetchStatus === 'fetching' ? <span className="loading loading-spinner loading-sm"></span> : 
                <div className="w-full flex justify-between items-center px-3 md:px-5">
                  <div className="flex gap-2">
                    <Tooltip title="Edit" arrow>
                      <i className="w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-neutral hover:bg-warning/50 hover:border-none z-30 transition-all duration-200 cursor-pointer">
                        <ColorLensRoundedIcon onClick={() => setShowColorPallete(!showColorPallete)} sx={{ fontSize: 18 }}/>
                      </i>
                    </Tooltip>
                  </div>
  
  
                  <Tooltip title="Update" arrow>
                    <button type="submit" className={wordCount > 0 ? "cursor-pointer w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-neutral hover:bg-primary/10 z-30 transition-all duration-200" : "cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"}> <CheckRoundedIcon/></button>
                  </Tooltip>
                </div>
                }
            </div>
        </form>}

        <div className="w-full flex flex-col justify-center items-center">

            {!isLoading && todos?.data.length > 0 ? <div className="w-full gap-4 flex flex-col items-center justify-center">
                <div className="w-full gap-2 md:gap-4 columns-2 md:columns-3 mx-auto space-y-3 md:space-y-4">
                  {
                    todos?.data.map((todo) => (
                        <Todo key={todo.id} 
                        noteId={todo.id}
                        note={todo.data_value}
                        bgColor={todo.bg_color}
                        updateId={todo.id}
                        />
                    ))
                  }
                </div>
            </div> : isLoading ? <div className="py-52 w-full  flex justify-center items-center">A moment please...</div> : 
            <div className="py-52 w-full  flex justify-center items-center">
              <div className="flex flex-col w-full md:w-96 text-neutral-500 justify-center items-center text-center">
                <DescriptionIcon  sx={{ fontSize: 300 }}/>
                <p>You have no <b>Noets</b> yet. Click the create below Icon to create one..</p>
              </div>
            </div>
            }
          
          {<Tooltip title="Add Noet" arrow className="absolute bottom-10">
            <button type="submit" className="cursor-pointer w-16 h-16 lg:w-20 lg:h-20 flex justify-center items-center rounded-full bg-neutral text-white transition-all duration-200 z-40" onClick={() => setShowInput(!showInput)}> {showInput ? <ClearRoundedIcon sx={{ fontSize: 30 }}/> : <AddRoundedIcon sx={{ fontSize: 30 }}/>}</button>
          </Tooltip>}
        </div>

    </div>
  )
}

export default Home