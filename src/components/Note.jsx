import { useCallback, useContext, useEffect, useState } from "react"
import Linkify from "linkify-react";
import useDeleteNotes from "../hooks/useDeleteNotes"
import useUpdateNote from "../hooks/useUpdateNote"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from'@mui/icons-material/CheckRounded';
import ColorPallete from "./ColorPallete";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { AnimatePresence, motion } from 'framer-motion'
import moment from "moment/moment";
import { useSelector } from "react-redux";
import usePin from "../hooks/usePin";
import { CircularProgress } from "@mui/material";
import { CopyToClipboard } from "./CopyToClipboard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { CheckCircle } from "@mui/icons-material";
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { AppContext } from "../context/AppContext";
import { ShareNote } from "./ShareNote";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

/* eslint-disable react/prop-types */
const Note = ({noteId, title, note, note_date, note_privacy, bgColor, draggedNote, activeNote, handleDrop}) => {

  const [getNote, setGetNote] = useState(note)
  const [getNoteTitle, setGetNoteTitle] = useState(title)
  const [wordCount, setWordCount] = useState(note.length)
  const [debouncedTitleInput, setDebouncedTitleInput] = useState("")
  const [debouncedNoteInput, setDebouncedNoteInput] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState(bgColor)
  const [noteChecked, setnoteChecked] = useState(false)
  const [notePrivacy, setNotePrivacy] = useState(note_privacy)
  const [toggleAction, setToggleAction] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stateLoading = useSelector((state) => state.app.isLoading)
  const { markedNotes, setMarkedNotes } = useContext(AppContext)
  const findMarkedNote = markedNotes.some(id => id === noteId)

  // const editNoteRef = useRef()

  const {mutate, isPending} = useDeleteNotes()
  const {mutate:updatePin, isPending:updatingPin, } = usePin()
  const {mutate:update, isPending:updating, } = useUpdateNote()

  //  Capture the ID from the URL
  const activeNoteId = searchParams.get("note");

  // check is editing by comparing noteId with activeNoteId from url
  const isEditing = activeNoteId === noteId.toString();
  
  // handle navigation
  const handleNav = useCallback(() => {
    if (!isEditing && !updating) {
      navigate(`/?note=${noteId}`, { replace: true });
    } else {
      navigate(`/`, { replace: true });
    }
    setToggleAction(false)
  }, [isEditing, navigate, noteId]);

  // update note function
  const updateNote = useCallback((title, input, color, notePrivacy, shouldNavigate = false) => {
    if(input.trim() !== "") {
      update(
        { id: noteId, title, data_value: input.trim(), bg_color: color, privacy: notePrivacy },
        { 
          onSuccess: () => {
            if (shouldNavigate) handleNav();
            toast.success("Note updated!", {
              className: "text-xs w-fit pr-24"
            })
          } 
        }
      )

      setShowColorPallete(false)
    } else {
      setGetNote('')
      setWordCount(0)
      setShowColorPallete(false)
      setNotePrivacy(true)
    }
  }, [noteId, title, colorOptionValue, notePrivacy, update, handleNav, setGetNote, setWordCount, setShowColorPallete])

  // debounce note input for auto save
  useDebounce(() => {
    if (getNote && isEditing) {
      updateNote(getNoteTitle, getNote, colorOptionValue, notePrivacy, false);
      setDebouncedTitleInput(getNoteTitle);
      setDebouncedNoteInput(getNote);
    }
    }, 1500, [getNoteTitle, getNote, updateNote, isEditing]
  )

  // disable scroll when editing or deleting note
  useEffect(() => {
    if (isEditing || showDeleteModal) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => e.key === "Escape" && handleNav();
      window.addEventListener("keydown", handleEsc);
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener("keydown", handleEsc);
      };
    }
    if (!isEditing) {
      setShowColorPallete(false)
      setColorOptionValue(bgColor)
      setGetNote(note)
    }
  }, [isEditing, showDeleteModal, handleNav, bgColor, note]);

  useEffect(() => {
    if(findMarkedNote) {
      setnoteChecked(true)
    } else {
      setnoteChecked(false)
    }
  }, [noteChecked, findMarkedNote])

  
  // handle change for title input
  const handleTitleChange = (e) => {
    setGetNoteTitle(e.target.value)
  }

  // handle change for form
  const handleChange = (e) => {
    setGetNote(e.target.value)
    setWordCount(e.target.value.length)
  }

  // for pinning notes 
  const handlePinUpdate = () => {
      // console.log(!draggedNote.pinned)
    updatePin({ pinned: !draggedNote.pinned, id: noteId })
  }

  // handke note update
  const handleNoteUpdate = (e) => {
    e.preventDefault()
    updateNote(getNote, colorOptionValue, notePrivacy, true);
  }

  // clearing form 
  const clearInput = () => {
    setGetNote("")
    setWordCount(0)
    // setColorOptionValue("")
  }

  // handle marking notes
  const handleMarkNotes = () => {
    if(!noteChecked) {
      setnoteChecked(true)
      setMarkedNotes(prev => [...prev, noteId])
    } else {
      setnoteChecked(false)
      setMarkedNotes(prev => prev.filter(id => id !== noteId))
    }
  }

  // truncating long notes to only 599 characters for Note Component rendering 
  const truncateNote = (x) => {
      if(x.length > 600) {
          return x.substring(0, 599).concat('...')
      } else  {
          return x
      }
  }

  let getColorValue;

  // handle color option
  const handleColorOption = (e) => {
    getColorValue = (e.target.className).split(" ").filter((x) => /bg-/.test(x))[0]
    setColorOptionValue(getColorValue)
    setShowColorPallete(!showColorPallete)
  }

  // handle delete note 
  const handleDeleteNote = () => {
    mutate([noteId], {
      onSuccess: () => {
        setShowDeleteModal(false);
      }
    });
  }

  // custom link render for linkify
  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return <a href={href} target="_blank" {...props} className="relative z-20 hover:underline">{content}</a>;
  };

  // All about longPress 
  let timer;
  const pressDuration = 500; // duration for long press in milliseconds

  const start = () => {
    // Start the timer
    timer = setTimeout(() => {
      handleMarkNotes();
      // Trigger your long press logic here
    }, pressDuration);

    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };
  }

  const cancel = () => {
    // Stop the timer if it hasn't finished yet
    clearTimeout(timer);
  }
  
  return (
     <article className="note">
 
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2 }}
          // layout
          // transition={{ 
          //   duration: 0.5, 
          //   ease: "easeInOut",
          //   layout: { type: "tween", duration: 0.5, ease: "easeInOut" }
          // }}
          // layoutId={`note-${noteId}`}
          className={`group flex flex-col justify-between relative break-inside-avoid pt-2 aspect-video w-full ${bgColor} rounded-2xl text-lg ${noteChecked ? "shadow-lg border-[#255f6f] border-[2px]" : "hover:lg:shadow-lg"} transition-all duration-300 ease-in-out break-words active:cursor-grab ${showDrop ? "border-[#114f60] border-2 z-50" : "border-[1px] border-black/10"} ${toggleAction ? "z-[70]" : "z-10"}`} draggable="true"
          
          // long press and mobile drag events
          onMouseDown={start}
          onMouseUp={cancel}
          onTouchStart={start}
          onTouchEnd={cancel}

          // dragging events
          onDragStart={() => activeNote(draggedNote) & cancel()} 
          onDragEnd={() => activeNote(null)}
          onDragEnter={() => setShowDrop(true)} 
          onDragLeave={() => setShowDrop(false)}
          onDrop={() => {
            handleDrop(),
            setShowDrop(false)
          }}
          onDragOver={(e) => e.preventDefault()}
        >

          {/* overlay to open note edit modal */}
          {!noteChecked && <div className="absolute w-full h-full" onClick={markedNotes.length > 0 ? handleMarkNotes : handleNav}></div>}
          
          {/* note div  */}
          <div className={`w-full ${note.length > 300 && "text-sm"} block leading-normal px-3 pb-4`}>
            <Tooltip title="Mark Note" arrow placement="top">
              <button className={`relative -top-5 right-5 ${noteChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100"} float-right w-fit h-fit flex justify-center items-center rounded-full -left-2 transition-all duration-300`} type="button" onClick={handleMarkNotes}>
                { noteChecked ? <CheckCircle sx={{ fontSize: 28, color: "#255f6f", backgroundColor: "white", borderRadius: "50%" }}/> :
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 28, color: "#255f6f", backgroundColor: "white", borderRadius: "50%" }}/>}
              </button>
            </Tooltip>
            
            <Linkify options={{ render: renderLink }}>
                <pre className={`break-words whitespace-pre-wrap font-sans line-clamp-6 lg:line-clamp-none`}>{
                  truncateNote(note)
                }</pre>
            </Linkify>
          </div>

          {/* date and actions  */}
          <div className={`${markedNotes.length > 0 ? "opacity-0 group-hover:opacity-0" : "opacity-100" } flex items-center justify-between px-4 py-3 bg-black/5 rounded-b-2xl backdrop-blur-sm border-t border-black/5 transition-opacity ${!toggleAction && !markedNotes.length > 0 && "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"} z-[70]`}>
          
            {/* overlay to open note edit modal when actions are toggled  */}
            {!markedNotes.length > 0 && <div className="absolute left-0 w-full h-full z-10" onClick={handleNav}></div>}
            
            {/* date  */}
            <div className="flex flex-col text-[10px] text-gray-500 font-medium">
              <span className="uppercase tracking-tighter opacity-70">Noted</span>
              <b className="text-gray-700">{moment(note_date).format("MMM D, YYYY")}</b>
            </div>
            
            {/* action buttons  */}
            <div className={`relative w-fit ${markedNotes.length > 0 ? "hidden" : "flex"} lg:gap-2 z-[60]`}>
              <Tooltip title={!notePrivacy ? "Public" : "Private"} placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-[#114f60]/20 pointer z-50">
                {notePrivacy ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}
              </Tooltip>
              <Tooltip title="Pin" placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-[#114f60]/20 pointer z-50" onClick={() => handlePinUpdate()}>
                  {updatingPin ? <CircularProgress size="20px" color="inherit"/> : !draggedNote.pinned ? <PushPinOutlinedIcon/> : <PushPinRoundedIcon />}
              </Tooltip>
              <Tooltip title="Actions" placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-[#114f60]/20 pointer z-50" onClick={() => setToggleAction(!toggleAction)}>
                <MoreVertIcon/>
              </Tooltip>
              
              {/* Dropdown Menu */}
              <div className={`absolute ${!toggleAction ? "scale-0" : "scale-100"} bottom-10 right-2 text-xs bg-white shadow-lg border-[0.2px] border-black/50 rounded-md overflow-hidden duration-300 transition-all z-[70]`}>
                  <ul>
                      <li className="flex justify-between items-center gap-5 hover:bg-gray-100 p-2 cursor-pointer duration-300 transition-all" onClick={handleNav}>Edit/View <EditNoteRoundedIcon sx={{ fontSize: 12 }}/></li>
                      <li className="flex justify-between hover:text-red-500 hover:bg-red-100/50 p-2 cursor-pointer duration-300 transition-all" onClick={() => setShowDeleteModal(!showDeleteModal) & setToggleAction(false)}>Delete <DeleteRoundedIcon sx={{ fontSize: 12 }} /></li>
                  </ul>
              </div>
            </div>
          </div>
        </motion.div>

       <div className={toggleAction ? "fixed w-full h-full top-0 left-0 z-[65]" : "hidden"} onClick={() => setToggleAction(false)}></div>

        {/* Edit modal  */}
       <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed w-full h-full top-0 left-0 p-5 md:py-10 flex justify-center items-center z-[70]"
          >
            {/* backdrop */}
            <div className="fixed w-full h-full bg-black/40 backdrop-blur-sm" onClick={handleNav}></div>

            <div className="w-full h-full md:w-[80%] lg:w-[60%] md:lg-auto group">
              <motion.form
                onSubmit={handleNoteUpdate}
                className="opacity-100 relative flex flex-col w-full h-full bg-white border rounded-[2rem] shadow-md duration-150 transition-all z-50 overflow-hidden"
              >
                {/* Header Section */}
                <div className="flex items-center justify-between px-6 py-4">
                  <span className={`flex gap-2 flex-row border-[1px] px-4 py-2 rounded-full ${colorOptionValue} text-[10px] uppercase tracking-wider text-gray-600 font-light transition-all duration-150`}>
                    noted on <b className="font-bold">{moment(note_date).format("Do MMMM, YYYY")}</b>
                  </span>

                  {/* close button or loading */}
                  {updating || stateLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <button
                      className="w-8 h-8 z-20 border-[1px] hover:bg-black/10 rounded-full transition-all duration-300"
                      type="button"
                      onClick={handleNav}
                    >
                      <ClearRoundedIcon />
                    </button>
                  )}
                </div>

                {/* Title Field */}
                <div className="px-8 mb-2">
                  <input
                    type="text"
                    name="title"
                    value={getNoteTitle} // Ensure you have a state for the title (e.g., getNoteTitle)
                    onChange={handleTitleChange} // Your title change handler
                    placeholder="Title"
                    className={`w-full outline-none font-bold text-xl md:text-2xl py-2 ${colorOptionValue} placeholder:text-gray-400 transition-all duration-300`}
                  />
                </div>

                {/* Textarea (Note Body) */}
                <textarea
                  autoFocus
                  value={getNote}
                  onChange={handleChange}
                  className={`w-full flex-grow outline-none resize-none placeholder:text-black px-8 py-4 text-base z-30 transition-all duration-300 ${colorOptionValue}`}
                  placeholder="Write Note"
                />

                {/* Action Buttons Footer */}
                <div className="relative w-full md:flex justify-center items-center py-8">
                  <div className="relative w-full flex justify-center gap-4 items-center px-3 md:px-5">
                    
                    {/* color pallete component */}
                    <ColorPallete show={showColorPallete} colorOption={colorOptionValue} addBackground={handleColorOption} />

                    <Tooltip title="Choose color" arrow placement="top">
                      <i
                        className={`w-10 h-10 flex justify-center items-center rounded-full ${showColorPallete ? "bg-warning shadow-lg border-none" : "border-[1px] border-neutral"} hover:bg-warning hover:border-none z-30 transition-all duration-200 cursor-pointer `}
                        onClick={() => setShowColorPallete(!showColorPallete)}
                      >
                        <ColorLensRoundedIcon sx={{ fontSize: 18 }} />
                      </i>
                    </Tooltip>

                    {/* copy text to clipboard */}
                    <CopyToClipboard text={getNote} wordCount={wordCount} />

                    {/* Clear input */}
                    <Tooltip title="Clear Note" arrow placement="top">
                      <button
                        className={wordCount > 0 ? "w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-red-500 hover:border-none transition-all duration-300" : "w-0 h-0 opacity-0 transition-all duration-200"}
                        type="button"
                        onClick={clearInput}
                      >
                        <ClearAllRoundedIcon sx={{ fontSize: 18 }} />
                      </button>
                    </Tooltip>

                    {/* Toggle privacy */}
                    <Tooltip title={notePrivacy ? "Make Note Public" : "Make Note Private"} arrow placement="top">
                      <button
                        className={`${wordCount > 0 ? "w-10 h-10 rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-black hover:border-none " : "w-0 h-0 opacity-0"} ${notePrivacy && "bg-black text-white"} flex justify-center items-center transition-all duration-300`}
                        type="button"
                        onClick={() => setNotePrivacy(!notePrivacy)}
                      >
                        {notePrivacy ? <LockRoundedIcon sx={{ fontSize: 18 }} /> : <LockOpenRoundedIcon sx={{ fontSize: 18 }} />}
                      </button>
                    </Tooltip>

                    {!notePrivacy && <ShareNote text={getNote} wordCount={wordCount} />}

                    {/* update button */}
                    {(getNote !== debouncedNoteInput || getNoteTitle !== debouncedTitleInput) && (!updating || !stateLoading) && (
                      <Tooltip title="Update Note" arrow placement="top">
                        <button
                          type="submit"
                          className={wordCount > 0 ? "h-10 flex justify-center items-center rounded-full px-5 border-[1px] border-[#114f60] shadow-lg text-[#114f60] hover:text-white hover:bg-[#114f60] hover:border-none transition-all duration-300" : "w-0 h-0 opacity-0 transition-all duration-200"}
                        >
                          <CheckRoundedIcon sx={{ fontSize: 18 }} />
                        </button>
                      </Tooltip>
                    )}

                    {/* word count desktop */}
                    <span className="hidden lg:block lg:absolute left-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                      {wordCount} characters
                    </span>
                  </div>

                  {/* word count mobile */}
                  <span className="w-full lg:hidden absolute text-center bottom-[4px] text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                    {wordCount} characters
                  </span>
                </div>
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Delete modal  */}
        <AnimatePresence>
          <ConfirmModal 
            action={showDeleteModal}
            setAction={setShowDeleteModal}
            pending={isPending}
            handleConfirm={handleDeleteNote}
            title={"Delete Note?"}
            desc={`You are about to delete a note. This action is permanent. Are you sure you want to proceed? `}
          />
        </AnimatePresence>
    </article>
  )
}

export default Note


// (setTodoHeight(noteRef.current.offsetHeight)