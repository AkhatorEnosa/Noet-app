import { useRef, useState } from "react"
import Linkify from "linkify-react";
import useDeleteNote from "../hooks/useDeleteNote"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from'@mui/icons-material/CheckRounded';
import ColorPallete from "./ColorPallete";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useUpdateNote from "../hooks/useUpdateNote";
import Tooltip from '@mui/material/Tooltip';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { motion } from 'framer-motion'
import moment from "moment/moment";
import { useSelector } from "react-redux";
import usePin from "../hooks/usePin";
import { CircularProgress } from "@mui/material";

/* eslint-disable react/prop-types */
const Note = ({note, noteId, note_date, bgColor, draggedNote, activeNote, handleDrop}) => {

  const [getNote, setGetNote] = useState(note)
  const [wordCount, setWordCount] = useState(note.length)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState(bgColor)
  const [toggleAction, setToggleAction] = useState(false)
  const [showDrop, setShowDrop] = useState(false)

  const stateLoading = useSelector((state) => state.data.isLoading)

  const editNoteRef = useRef()

  const {mutate, isPending} = useDeleteNote()
  const {mutate:updatePin, isPending:updatingPin, } = usePin()
  const {mutate:update, isPending:updating, } = useUpdateNote()

  const handleChange = (e) => {
    setGetNote(e.target.value)
    setWordCount(e.target.value.length)
  }

  const handlePinUpdate = () => {
      // console.log(!draggedNote.pinned)
      updatePin({pinned: !draggedNote.pinned, id: noteId})
  }

  const handleNoteUpdate = (e) => {
    e.preventDefault()
    if(getNote.trim() !== "") {
      update({data_value: getNote.trim().toString(), id: noteId, bg_color: colorOptionValue})
      
      setTimeout(() => {
        if(!updating) {
          setShowEditModal(!showEditModal)
        }
      }, 1000);

      setShowColorPallete(false)
    } else {
      setGetNote('')
      setWordCount(0)
      setShowColorPallete(false)
    }
  }

  const clearInput = () => {
    setGetNote("")
    setWordCount(0)
    // setColorOptionValue("")
  }

  const closeInput = () => {
    setGetNote(note)
    setWordCount(note.length)
    setShowEditModal(!showEditModal)
    setShowColorPallete(false)
  }


  const truncateNote = (x) => {
      if(x.length > 600) {
          return x.substring(0, 599).concat('...')
      } else  {
          return x
      }
  }

  const handleColorOption = (e) => {
    const getColorValue = (e.target.className).split(" ").filter((x) => /bg-/.test(x))[0]
    setColorOptionValue(getColorValue)
  }

  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return <a href={href} target="_blank" {...props} className="relative z-20 hover:underline">{content}</a>;
  };
  
  return (
     <article className="note">
 
        <motion.div
          initial={{
            scale: 0.85
          }}
          animate={{
            scale: 1
          }}
          exit={{
            scale: 1
          }}
          transition={{
            type: "linear",
            stiffness: 1,
            duration: 0.08,
            ease: "easeInOut"
          }}
          layout

          className={showEditModal || showDeleteModal ? "opacity-0 break-inside-avoid w-full" : `group relative break-inside-avoid aspect-video w-full ${bgColor} rounded-md text-lg hover:lg:shadow-lg hover:lg:-top-1 transition-all duration-200 break-words active:cursor-grab ${showDrop ? "border-blue-500 border-2 z-50" : "border-[1px] border-black/10"} ${toggleAction ? "z-40" : "z-10"}`} draggable="true" 

            onDragStart={() => activeNote(draggedNote)} 
            onDragEnd={() => activeNote(null)}
            onDragEnter={() => setShowDrop(true)} 
            onDragLeave={() => setShowDrop(false)}
            onDrop={() => {
              handleDrop(),
              setShowDrop(false)
            }}
            onDragOver={(e) => e.preventDefault()}
        >

          <div className="absolute w-full h-full" onClick={() => setShowEditModal(!showEditModal) & setToggleAction(false)}></div>

          {/* <div className={showDrop ? "absolute w-full border-blue-500 border-2 rounded-md h-full z-50" : ""}></div> */}
          <div className={`relative w-full px-2 py-2 gap-2 mb-2 flex justify-between md:justify-end items-center rounded-md shadow lg:shadow-none group-hover:shadow ${!showDrop && "bg-white/80 z-50"}`}>
            <div className="w-full h-fit lg:w-fit flex gap-0 md:gap-2 flex-col lg:flex-row group-hover:lg:opacity-100 lg:opacity-0 text-[12px] md:text-xs font-light transition-all duration-150"><span className="h-fit hidden md:block">noeted on</span> <b className="font-bold">{moment(note_date).format("Do MMMM, YYYY")}</b></div>
            <div className="w-fit flex lg:gap-2">
              <Tooltip title="Pin" placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-blue-500/20 pointer z-50" onClick={() => handlePinUpdate()}>
                  {updatingPin ? <CircularProgress size="20px" color="inherit"/> : !draggedNote.pinned ? <PushPinOutlinedIcon/> : <PushPinRoundedIcon />}
              </Tooltip>
              <Tooltip title="Actions" placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-blue-500/20 pointer z-50" onClick={() => setToggleAction(!toggleAction)}>
                <MoreVertIcon/>
              </Tooltip>
              {toggleAction && 
                <div className="absolute w-[50%] top-12 right-1 text-xs bg-white shadow-lg border-[0.2px] border-black/50 rounded-md z-50">
                  <ul>
                    <li className="flex justify-between hover:bg-neutral-400 p-2 z-50" onClick={() => setShowEditModal(!showEditModal) & setToggleAction(false)}>Edit/View <EditNoteRoundedIcon sx={{ fontSize: 12 }}/></li>
                    <hr className="border-[0.2px] border-black/10"/>
                    <li className="flex justify-between hover:bg-neutral-400 p-2" onClick={() => setShowDeleteModal(!showDeleteModal) & setToggleAction(false)}>Delete <DeleteRoundedIcon sx={{ fontSize: 12 }}/></li>
                  </ul>
                </div>
              }
            </div>
          </div>
          <div className={`w-full ${note.length > 300 && "text-sm"} w-full leading-normal px-3 pt-2 pb-4`}>
            <Linkify options={{ render: renderLink }}>
                <pre className={`break-words whitespace-pre-wrap font-sans line-clamp-6 lg:line-clamp-none`}>{
                  truncateNote(note)
                }</pre>
            </Linkify>
          </div>
        </motion.div>

       <div className={toggleAction ? "fixed w-full h-full top-0 left-0 z-30" : "hidden"} onClick={() => setToggleAction(false)}></div>

        {/* Edit modal  */}
        <div className={showEditModal ? "fixed w-full h-full top-0 left-0 md:py-10 flex justify-center items-center z-50" : "opacity-0 fixed w-full h-full top-0 left-0 flex justify-center items-center -z-50"}>

              {/* backdrop  */}
              <div className={showEditModal && "fixed w-full h-full md:bg-black/75"} onClick={() => setShowEditModal(!showEditModal)}></div>

              <div className="w-full h-full md:w-[80%] lg:w-[60%] md:lg-auto group">
                <form onSubmit={handleNoteUpdate} className={`${showEditModal ? "opacity-100" : "opacity-0"} relative flex flex-col w-full h-full pb-2 bg-white border justify-between rounded-lg shadow-md duration-150 transition-all z-50`}>

                  <div className="flex items-center justify-end gap-2 px-2 py-2">
                    <span className={`flex lg:gap-2 flex-row border-[1px] px-4 py-2 rounded-full ${colorOptionValue} text-xs font-light transition-all duration-150`}>noeted on <b className="font-bold">{moment(note_date).format("Do MMMM, YYYY")}</b></span>
                    <button className={"w-8 h-8 z-20 border-[1px] hover:bg-black/10 rounded-full transition-all duration-300"} type="button" onClick={closeInput}><ClearRoundedIcon /></button>
                  </div>

                  <textarea type="text" ref={editNoteRef} value={getNote} onChange={handleChange} className={`w-full h-[90%] outline-none resize-none placeholder:text-black p-4 text-base rounded-lg z-30 transition-all duration-300`} placeholder="Write Noet"/>

                  <div className="relative w-full flex justify-center items-center py-10">
                      <ColorPallete show={showColorPallete} addBackground={handleColorOption}/>
                      
                      {updating || stateLoading ? <span className="loading loading-spinner loading-sm"></span> : 
                      <div className={`w-full flex justify-center gap-4 items-center px-3 md:px-5 pt-4`}>
                        <div className="flex gap-2 justify-center items-center">
                          <Tooltip title="Choose color" arrow>
                            <i className={`w-10 h-10 flex justify-center items-center rounded-full ${showColorPallete ? 'bg-warning shadow-lg border-none' : 'border-[1px] border-neutral'} hover:bg-warning hover:border-none z-30 transition-all duration-200 cursor-pointer `} onClick={() => setShowColorPallete(!showColorPallete)}>
                              <ColorLensRoundedIcon sx={{ fontSize: 18 }}/>
                            </i>
                          </Tooltip>
                        </div>


                         <Tooltip title="Erase" arrow>
                          <button className={wordCount > 0 ? "w-10 h-10 flex justify-center items-center rounded-full top-2 right-2 px-2 py-2 bg-gray-400 shadow-lg border-none text-white hover:text-neutral transition-all duration-300": "w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"} type="button" onClick={clearInput}><ClearAllRoundedIcon /></button>
                        </Tooltip>


                        <Tooltip title="Update" arrow>
                          <button type="submit" className={wordCount > 0 ? "cursor-pointer w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-neutral bg-neutral text-white z-30 transition-all duration-200" : "cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"}> <CheckRoundedIcon/></button>
                        </Tooltip>
                      </div>
                      }
                  </div>
                </form>
              </div>
        </div>

        {/* Delete modal  */}
        <div
          className={showDeleteModal ? "fixed w-full h-full top-0 left-0 flex px-6 justify-center items-center z-50" : "opacity-0 fixed w-full h-full top-0 left-0 flex justify-center items-center -z-50"}>

            {/* backdrop  */}
            <div className={showDeleteModal && "w-full h-full fixed bg-black md:bg-black/75"} onClick={() => setShowDeleteModal(!showDeleteModal)}></div>

            <div className={`w-full h-fit md:w-96 md:h-auto flex flex-col gap-3 px-4 py-4 ${showDeleteModal ? "opacity-100" : "opacity-0"} bg-white rounded-md transition-all duration-150 z-30`}>
                <h1 className="text-lg font-semibold">Delete</h1>
                <hr />
                <p className="text-sm">Are you sure you want to Delete?</p>
                <div className="w-full flex justify-center items-center gap-5 mt-5 text-sm">
                  {isPending || stateLoading ? <span className="loading loading-spinner loading-sm"></span> : <><button className="flex justify-center items-center p-3 hover:bg-[#ff2222] bg-error rounded-md text-sm text-white" onClick={() => mutate(noteId) && setShowDeleteModal(false)}><DeleteRoundedIcon />Yes, Delete</button>
                  <button className="flex justify-center items-center p-3 bg-neutral hover:bg-black text-white rounded-md" onClick={() => setShowDeleteModal(!showDeleteModal)}><ClearRoundedIcon/>Cancel</button></>}
                </div> 
            </div>
        </div>
    </article>
  )
}

export default Note


// (setTodoHeight(noteRef.current.offsetHeight)