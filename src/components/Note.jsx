import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import Linkify from "linkify-react";
import useDeleteNotes from "../hooks/useDeleteNotes"
import useUpdateNote from "../hooks/useUpdateNote"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
// import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { CheckCircle } from "@mui/icons-material";
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import NoteModal from "./NoteModal";

/* eslint-disable react/prop-types */
const Note = ({noteId, title, note_value, note_date, note_privacy, bgColor, noteObj, activeNote, handleDrop}) => {

  const [getNote, setGetNote] = useState(note_value)
  const [getNoteTitle, setGetNoteTitle] = useState(title)
  const [wordCount, setWordCount] = useState(note_value.length)
  const [debouncedTitleInput, setDebouncedTitleInput] = useState("")
  const [debouncedNoteInput, setDebouncedNoteInput] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState(bgColor)
  const [debouncedColorOption, setDebouncedColorOption] = useState(bgColor)
  const [noteChecked, setnoteChecked] = useState(false)
  const [notePrivacy, setNotePrivacy] = useState(note_privacy)
  const [debouncedNotePrivacy, setDebouncedNotePrivacy] = useState(note_privacy)
  const [noteIsPinned, setNoteIsPinned] = useState(noteObj.pinned)
  const [toggleAction, setToggleAction] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stateLoading = useSelector((state) => state.app.isLoading)
  const { markedNotes, setMarkedNotes, autoSave } = useContext(AppContext)
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

  // update note_value function
  const updateNote = useCallback((title, input, color, privacy, shouldNavigate = false) => {
    if(input.trim() !== "") {
      update(
        { id: noteId, title, data_value: input.trim(), bg_color: color, privacy: privacy },
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
  }, [noteId, update, handleNav])

  // debounce note_value input for auto save
  useDebounce(() => {
    if (getNote && isEditing && (getNote !== debouncedNoteInput || getNoteTitle !== debouncedTitleInput || colorOptionValue !== debouncedColorOption || notePrivacy !== debouncedNotePrivacy) && autoSave == "true" && !updating && !stateLoading) {
      updateNote(getNoteTitle, getNote, colorOptionValue, notePrivacy, false);
      setDebouncedTitleInput(getNoteTitle);
      setDebouncedNoteInput(getNote);
      setDebouncedColorOption(colorOptionValue)
      setDebouncedNotePrivacy(notePrivacy)
    }
    }, 1500, [getNoteTitle, getNote, colorOptionValue, notePrivacy, isEditing, autoSave, updateNote]
  )

  // disable scroll when editing or deleting note_value
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
      setGetNote(note_value)
    }
  }, [isEditing, showDeleteModal, handleNav, bgColor, note_value]);

  useEffect(() => {
    if(findMarkedNote) {
      setnoteChecked(true)
    } else {
      setnoteChecked(false)
    }
  }, [noteChecked, findMarkedNote])


  useEffect(() => {
    // compare noteispinned and noteObj.pinned and only updatepin when they are different and !isEditing
    if (noteIsPinned !== noteObj.pinned && !isEditing) {
      updatePin({ pinned: noteIsPinned, id: noteId })
    }
  }, [noteIsPinned, noteObj.pinned, noteId, updatePin, isEditing])

  // for pinning notes 
  const handlePinUpdate = () => {
      // console.log(!noteObj.pinned)
    setNoteIsPinned(prev => !prev)
    // updatePin({ pinned: !noteIsPinned, id: noteId })
  }

  // clearing form 
  // const clearInput = () => {
  //   setGetNote("")
  //   setWordCount(0)
  //   // setColorOptionValue("")
  // }

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
    if (x.length > 600) {
      return x.substring(0, 599).concat('...')
    } else {
      return x
    }
  }

  // handle delete note_value 
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
  const timerRef = useRef();

  const startLongPress = useCallback(() => {
    timerRef.current = setTimeout(() => {
      handleMarkNotes();
    }, 1000);
  }, []);

  const cancelLongPress = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  const notePreview = useMemo(() => (
    <Linkify options={{ render: renderLink }}>
      <pre className="break-words whitespace-pre-wrap font-sans line-clamp-6 lg:line-clamp-none">{truncateNote(note_value)}</pre>
    </Linkify>
  ), [note_value]);
  
  return (
     <article className="note">
      <motion.div
        // layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
        // layoutId={`note_value-${noteId}`}
        className={`group flex flex-col justify-between relative break-inside-avoid pt-2 w-full ${bgColor} rounded-2xl text-lg break-words active:cursor-grab ${noteChecked ? "ring-black ring-[1px]" : showDrop ? "ring-[#114f60] ring-2 z-50" : "ring-[1px] ring-black/10"} ${toggleAction ? "z-[70]" : "z-10"} ${isEditing && (noteId == activeNoteId) ? "scale-0" : "scale-100"} transition-all duration-150 ease-in-out `} 
        draggable={!noteChecked ? true : false}
        
        // long press and mobile drag events
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}

        // dragging events
        onDragStart={() => activeNote(noteObj) & cancelLongPress()} 
        onDragEnd={() => activeNote(null)}
        onDragEnter={() => setShowDrop(true)} 
        onDragLeave={() => setShowDrop(false)}
        onDrop={() => {
          handleDrop(),
          setShowDrop(false)
        }}
        onDragOver={(e) => e.preventDefault()}
      >

        {/* overlay to open note_value edit modal */}
        {
          noteChecked
          ? <div className="absolute top-0 left-0 w-full h-full rounded-2xl z-[71]" onClick={() => handleMarkNotes()}></div> 
          : !noteChecked && markedNotes.length > 0 ? <div className="absolute top-0 left-0 w-full h-full rounded-2xl z-[71]" onClick={() => handleMarkNotes()}></div> 
          : ""
        }

        <div className="absolute top-0 left-0 w-full h-full rounded-2xl" onClick={() => handleNav()}></div>
        
        {/* note_value div  */}
        <div className={`w-full ${note_value.length > 300 && "text-sm"} block leading-normal px-3 pb-4`}>
          <Tooltip title="Mark Note" arrow placement="top">
            <button className={`relative -top-5 right-5 ${noteChecked ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"} float-right w-fit h-fit flex justify-center items-center rounded-full -left-2 transition-all duration-150 z-[65]`} type="button" onClick={() => handleMarkNotes()}>
              { noteChecked ? <CheckCircle sx={{ fontSize: 28, color: "#255f6f", backgroundColor: "white", borderRadius: "50%" }}/> :
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 28, color: "#255f6f", backgroundColor: "white", borderRadius: "50%" }}/>}
            </button>
          </Tooltip>

          {notePreview}
        </div>

        {/* date and actions  */}
        <div className={`hidden lg:flex ${markedNotes.length > 0 ? "opacity-0 group-hover:opacity-0" : "opacity-100" } flex items-center justify-between px-4 py-3 bg-black/5 rounded-b-2xl border-t border-black/5 transition-opacity ${!toggleAction && !markedNotes.length > 0 && "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"} z-[70]`}>
        
          {/* overlay to open note_value edit modal when actions are toggled  */}
          {!markedNotes.length > 0 && <div className="absolute left-0 w-full h-full z-10" onClick={() => handleNav()}></div>}
          
          {/* date  */}
          <div className="flex flex-col text-[10px] font-medium">
            <span className="uppercase tracking-tighter opacity-70">Noted</span>
            <b className="">{moment(note_date).format("MMM D, YYYY")}</b>
          </div>
          
          {/* action buttons  */}
          <div className={`relative w-fit ${markedNotes.length > 0 ? "hidden" : "flex"} lg:gap-2 z-[60]`}>
            <Tooltip title={!notePrivacy ? "Public" : "Private"} placement="top" arrow className="flex justify-center items-center w-5 h-5 p-1 rounded-full z-50">
              {notePrivacy ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}
            </Tooltip>

            <Tooltip title="Pin" placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-[#114f60]/20 z-50" onClick={() => handlePinUpdate()}>
                {updatingPin ? <CircularProgress size="20px" color="inherit"/> : !noteObj.pinned ? <PushPinOutlinedIcon/> : <PushPinRoundedIcon />}
            </Tooltip>

            <Tooltip title="Actions" placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-[#114f60]/20 z-50" onClick={() => setToggleAction(!toggleAction)}>
              <MoreVertIcon/>
            </Tooltip>
            
            {/* Dropdown Menu */}
            <div className={`absolute ${!toggleAction ? "scale-0" : "scale-100"} bottom-10 right-2 text-xs bg-white shadow-lg border-[0.2px] border-black/50 rounded-md overflow-hidden duration-150 transition-all z-[70]`}>
                <ul>
                    <li className="flex justify-between items-center gap-5 hover:bg-gray-100 p-2 cursor-pointer duration-150 transition-all" onClick={handleNav}>Edit/View <EditNoteRoundedIcon sx={{ fontSize: 12 }}/></li>
                    <li className="flex justify-between items-center gap-5 hover:bg-gray-100 p-2 cursor-pointer duration-150 transition-all" onClick={handleMarkNotes}>Mark <CheckCircleOutlineRoundedIcon sx={{ fontSize: 12 }}/></li>
                    <li className="flex justify-between hover:text-red-500 hover:bg-red-100/50 p-2 cursor-pointer duration-150 transition-all" onClick={() => setShowDeleteModal(!showDeleteModal) & setToggleAction(false)}>Delete <DeleteRoundedIcon sx={{ fontSize: 12 }} /></li>
                </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={toggleAction ? "fixed w-full h-full top-0 left-0 z-[65]" : "hidden"} onClick={() => setToggleAction(false)}></div>

      {/* Edit modal  */}
      <AnimatePresence>
        {isEditing && (
          <NoteModal
            setGetNoteTitle={setGetNoteTitle}
            setGetNote={setGetNote}
            setWordCount={setWordCount}
            getNoteTitle={getNoteTitle}
            getNote={getNote}
            colorOptionValue={colorOptionValue}
            notePrivacy={notePrivacy}
            setColorOptionValue={setColorOptionValue}
            setShowColorPallete={setShowColorPallete}
            showColorPallete={showColorPallete}
            wordCount={wordCount}
            setNotePrivacy={setNotePrivacy}
            debouncedNoteInput={debouncedNoteInput}
            debouncedTitleInput={debouncedTitleInput}

            note_date={note_date}
            noteIsPinned={noteIsPinned}
            updatingPin={updatingPin}
            stateLoading={stateLoading}
            updating={updating}
            isEditing={isEditing}

            updateNote={updateNote}
            handlePinUpdate={handlePinUpdate}
            handleNav={handleNav}
          />
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

export default React.memo(Note)