/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from 'react'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from'@mui/icons-material/CheckRounded';
import ColorPallete from "./ColorPallete";
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import { CopyToClipboard } from "./CopyToClipboard";
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import { ShareNote } from "./ShareNote";
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion'
import { CircularProgress, Tooltip } from '@mui/material';
import { convertTime } from '../utils/timeConverter';
import { verifyColorIsWhite } from '../utils/verifyColorIsWhite';
import { getColor } from '../utils/getColor';

const MAX_TITLE_WORDS = 15;
const MAX_NOTE_CHARACTERS = 30000;

const NoteModal = ({
    setGetNoteTitle,
    setGetNote,
    setWordCount,
    getNoteTitle,
    getNote,
    colorOptionValue,
    notePrivacy,
    setColorOptionValue,
    setShowColorPallete,
    showColorPallete,
    wordCount,
    setNotePrivacy,
    debouncedNoteInput,
    debouncedTitleInput,
    wordStore, 
    setWordStore,
    showDeleteModal,
    setShowDeleteModal,
    setToggleAction,

    note_date,
    updated_at,
    noteIsPinned,
    updatingPin,
    stateLoading,
    updating,
    isEditing,

    updateNote,
    handlePinUpdate,
    handleNav,
}) => {  
    // get textArea DOM by ref
    const textareaRef = useRef(null);
    const { autoSave, setAutoSave } = useContext(AppContext)
    
    const [expand, setExpand] = useState(false)
    const [titleWordCount, setTitleWordCount] = useState(getNoteTitle?.trim().split(/\s+/).length || 0);

    // Helper to get progress color based on percentage
    const getProgressColor = (percentage) => {
      if (percentage < 0.6) return '#22c55e'; // green
      if (percentage < 1) return '#eab308'; // yellow
      return '#ef4444'; // red
    }

    // Circular progress component for title word count
    const TitleWordProgress = () => {
      const percentage = Math.min(titleWordCount / MAX_TITLE_WORDS, 1);
      const color = getProgressColor(percentage);
      const size = 20;
      const strokeWidth = 3;
      const radius = (size - strokeWidth) / 2;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - percentage * circumference;

      return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          {/* <span 
            className="absolute text-[8px] font-bold"
            style={{ color: color, fontSize: '9px' }}
          >
            {Math.round(percentage * 100)}%
          </span> */}
        </div>
      )
    }

    useEffect(() => {
        // check if editing 
        if (isEditing && textareaRef.current) {
            const el = textareaRef.current;

            // timeout to move cursor caret 
            const timeoutId = setTimeout(() => {
            el.focus();
            
            // get textarea value length 
            const valueLen = el.value.length;

            // move cursorr
            el.setSelectionRange(valueLen, valueLen);
            
            // scroll to the end of textare value
            el.scrollTop = valueLen;
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [isEditing]);
    
    // handle autosave toggle 
    const handleAutoSaveToggle = () => {
        if (autoSave !== "true") {
        setAutoSave("true")
        localStorage.setItem("autoSave", "true")
        toast.info("Auto-save enabled. Your changes will be saved automatically.", {
            className: "text-xs w-fit pr-24"
        })
        } else {
        setAutoSave("false")
        localStorage.setItem("autoSave", "false")
        toast.info("Auto-save disabled. Remember to save your changes manually.", {
            className: "text-xs w-fit pr-24"
        })
        }
    }
  
    // handle change for title input
    const handleTitleChange = (e) => {
      const value = e.target.value;
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;

      if (wordCount > MAX_TITLE_WORDS) {
        // Truncate to 50 words
        const truncatedTitle = words.slice(0, MAX_TITLE_WORDS).join(' ');
        setGetNoteTitle(truncatedTitle);
        setTitleWordCount(MAX_TITLE_WORDS);
        toast.warning(`Title limited to ${MAX_TITLE_WORDS} words`, {
          className: "text-xs w-fit"
        });
      } else {
        setGetNoteTitle(value);
        setTitleWordCount(wordCount);
      }
    }

    // handle change for form
    const handleChange = (e) => {
      // handle words longer than MAX_NOTE_CHARACTERS
      const value = e.target.value;
      const characters = value.length;

      if (characters > MAX_NOTE_CHARACTERS) {
        setGetNote(e.target.value.slice(0, MAX_NOTE_CHARACTERS))
        setWordCount(MAX_NOTE_CHARACTERS)
        setWordStore("")
        // toast.warning(`Note limited to ${MAX_NOTE_CHARACTERS} characters`, {
        //   className: "text-xs w-fit"
        // })
        return;
      }

      setGetNote(value)
      setWordCount(characters)
      setWordStore("")
    }

    // handke note_value update
    const handleNoteUpdate = (e) => {
      e.preventDefault()
      updateNote(getNoteTitle, getNote, colorOptionValue, notePrivacy, true);
    }

    // handle color option
    const handleColorOption = (color) => {
      setColorOptionValue(color)
      setShowColorPallete(!showColorPallete)
    }

    const handlePrivacyToggle = () => {
      setNotePrivacy(!notePrivacy)
    }


    // Clear input field function
    const clearInput = () => {
      setWordStore(getNote)
      setWordCount(0)
      setGetNote("")
    }

    // revert input field function to restore cleared text
    const revertInput = () => {
      setGetNote(wordStore)
      setWordCount(wordStore.length)
      setWordStore("")
    }

    return (
    
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed w-full h-full top-0 left-0 ${!expand ? "sm:p-5 md:py-10" : "p-0"} flex justify-center items-center z-[70] duration-150 transition-all`}
      >
        {/* backdrop */}
        <div className="fixed w-full h-full bg-black/80" onClick={() => handleNav()}></div>

        <div className={`${expand ? "w-full h-full" : "w-full h-full lg:w-[90%] xl:w-[60%]"} group duration-150 transition-all`}>
          <motion.form
            onSubmit={handleNoteUpdate}
            className={`opacity-100 relative flex flex-col w-full h-full bg-white border ${!expand && "sm:rounded-[2rem]"} shadow-md duration-150 transition-all z-50 overflow-hidden`}
          >
            {/* Header Section */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <Tooltip title={updated_at !== null ? `Last updated on ${convertTime(updated_at)}` : `Note has not been updated since ${convertTime(note_date)}`} placement="bottom" arrow> 
                <span className={`flex gap-2 flex-row border-[1px] px-2 md:px-4 py-2 rounded-full ${colorOptionValue} text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-600 font-light transition-all duration-150`}>
                  noted on <b className="font-bold">{convertTime(note_date)}</b>
                </span>
              </Tooltip>

              <div className="flex gap-2 items-center z-20">
                {/* Expand note  */}
                <Tooltip title={ !expand ? "Go FullScreen" : "Revert to default" } placement="bottom" arrow className='hidden sm:flex'>
                  <button className={`w-8 h-8 flex justify-center items-center border-[1px] cursor-pointer p-1 rounded-full ${expand ? `${verifyColorIsWhite() ? "text-[#114f60] bg-[#114f60]/10" : colorOptionValue}` : "lg:hover:bg-[#114f60]/10 dark:hover:bg-[#3b8a9e]/30"} rounded-full cursor-pointer transition-all duration-150`} type="button"
                    onClick={() => setExpand(!expand)}
                  >
                       {expand ? <FullscreenExitRoundedIcon color="inherit"/> : <FullscreenRoundedIcon color="inherit"/>}
                  </button>
                </Tooltip>
                
                <Tooltip title="Pin" placement="bottom" arrow>
                  <button className={`w-8 h-8 flex justify-center items-center border-[1px] cursor-pointer p-1 rounded-full ${noteIsPinned ? `${verifyColorIsWhite() ? "text-[#114f60] bg-[#114f60]/10" : colorOptionValue}` : "lg:hover:bg-[#114f60]/10 dark:hover:bg-[#3b8a9e]/30"} rounded-full cursor-pointer transition-all duration-150`} type="button"
                    onClick={() => handlePinUpdate()}
                    disabled={updatingPin || stateLoading}
                  >
                      {updatingPin ? <CircularProgress size="20px" color="inherit"/> : !noteIsPinned ? <PushPinOutlinedIcon/> : <PushPinRoundedIcon />}
                  </button>
                </Tooltip>

                <Tooltip title={autoSave == "true" ? "Undo Auto-Save" : "Enable Auto-Save"} placement="bottom" arrow>
                  <button className={`w-8 h-8 flex justify-center items-center border-[1px] ${autoSave == "true" ? `${verifyColorIsWhite(colorOptionValue) ? "text-[#114f60] bg-[#114f60]/10" : colorOptionValue}` : "lg:hover:bg-[#114f60]/10 dark:hover:bg-[#3b8a9e]/30"} rounded-full cursor-pointer transition-all duration-150`} type="button"
                    onClick={() => handleAutoSaveToggle()}
                    disabled={updating || stateLoading}
                  >
                      {updating || stateLoading ? <span className="loading loading-spinner loading-sm"></span> : < UpdateRoundedIcon />}
                  </button>
                </Tooltip>

                {/* close button or loading */}
                <Tooltip title="Close Editing" placement="bottom" arrow>
                  <button className="w-8 h-8 border-[1px] hover:bg-black/10 rounded-full transition-all duration-150" type="button"
                    onClick={() => handleNav()}
                    disabled={updating || stateLoading}
                  >
                    <ClearRoundedIcon />
                  </button>
                </Tooltip>
              </div>

            </div>

            {/* input fields Section */}
            <div className={`relative w-full h-full flex flex-col ${colorOptionValue}`}>
              
              <div className='flex items-center justify-end px-4 bg-transparent md:px-8 py-4 pb-2 float-right'>
                {/* Title Field */}
                <input
                  type="text"
                  name="title"
                  value={getNoteTitle} // Ensure you have a state for the title (e.g., getNoteTitle)
                  onChange={handleTitleChange} // Your title change handler
                  placeholder="Title"
                  className={`w-full outline-none font-bold text-xl md:text-2xl  placeholder:text-${getColor(colorOptionValue)}/50 [unicode-bidi:plaintext] text-start ltr transition-all duration-150`}
                  dir='auto'
                />
                {getNoteTitle?.length > 0 && <Tooltip title={`${titleWordCount} of ${MAX_TITLE_WORDS} words used`} arrow placement="top">
                  <div className="cursor-help">
                    <TitleWordProgress />
                  </div>
                </Tooltip>}
              </div>

              {/* Textarea (Note Body) */}
              <textarea
                ref={textareaRef}
                value={getNote}
                onChange={handleChange}
                className={`w-full flex-grow outline-none resize-none placeholder:text-${getColor(colorOptionValue)}/50 px-4 md:px-8 py-4 pb-5 text-base [unicode-bidi:plaintext] text-start ltr z-30 transition-all duration-150 bg-transparent`}
                placeholder="Write Note"
                dir="auto"
              />
            </div>

            {/* Action Buttons Footer */}
            <div className="relative w-full flex flex-col lg:flex-row justify-center items-center gap-4 py-4 md:py-8">
              <div className="relative w-full flex justify-center gap-4 items-center px-3 md:px-5">
                
                {/* color pallete component */}
                <ColorPallete show={showColorPallete} colorOption={colorOptionValue} addBackground={handleColorOption} />
                
                {/* backdrop for colour pallete  */}
                <div className={`fixed w-full h-full top-0 left-0 z-[30] ${showColorPallete ? "scale-100" : "scale-0 opacity-0"} duration-150 transition-all`} onClick={() => setShowColorPallete(!showColorPallete)}></div>

                <Tooltip title="Choose colour" arrow placement="top">
                  <i className={`${wordCount > 0 ? "w-10 h-10 rounded-full" : "scale-0 w-0 h-0 opacity-0"} flex justify-center items-center rounded-full ${showColorPallete ? "bg-warning border-none" : "border-[1px] border-black"} text-black hover:bg-warning hover:border-none z-30 transition-all duration-150 cursor-pointer `}
                    onClick={() => setShowColorPallete(!showColorPallete)}
                  >
                    <ColorLensRoundedIcon sx={{ fontSize: 18 }} />
                  </i>
                </Tooltip>

                {/* copy text to clipboard */}
                <CopyToClipboard text={getNote} wordCount={wordCount} />

                {/* Toggle privacy */}
                <Tooltip title={notePrivacy ? "Make Note Public" : "Make Note Private"} arrow placement="top">
                  <button
                    className={`${wordCount > 0 ? "w-10 h-10 rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-black hover:border-none " : "scale-0 w-0 h-0 opacity-0"} ${notePrivacy && "bg-black text-white"} flex justify-center items-center transition-all duration-150`}
                    type="submit"
                    onClick={handlePrivacyToggle}
                  >
                    {notePrivacy ? <LockRoundedIcon sx={{ fontSize: 18 }} /> : <LockOpenRoundedIcon sx={{ fontSize: 18 }} />}
                  </button>
                </Tooltip>

                {!notePrivacy && <ShareNote title={getNoteTitle} text={getNote} wordCount={wordCount} />}
                
                {/* Clear all text */}
                <Tooltip title={ wordStore !== "" && wordCount < 1 ? "Revert Note" : "Clear Note" } placement="top" arrow>
                  <button
                    className={
                      wordCount > 0 && wordStore == ""
                        ? "w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-slate-400 hover:border-none transition-all duration-150" :
                        wordStore !== "" && wordCount < 1 ? "w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-slate-400 hover:border-none transition-all duration-150"
                        : "scale-0 w-0 h-0 opacity-0 transition-all duration-200"
                    }
                    type="button"
                    onClick={wordStore !== "" && wordCount < 1 ? revertInput : clearInput}
                  >
                    {wordStore !== "" && wordCount < 1 ? <HistoryRoundedIcon /> : <ClearAllRoundedIcon />}
                  </button>
                </Tooltip>

                {/* Delete Note */}
                <Tooltip title={"Delete Note"} arrow placement="top">
                  <button
                    className={`flex xl:hidden ${wordCount > 0 ? "w-10 h-10 rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-red-600 hover:border-none " : "scale-0 w-0 h-0 opacity-0"} flex justify-center items-center transition-all duration-150`}
                    type="submit"
                    onClick={() => setShowDeleteModal(!showDeleteModal) & setToggleAction(false)}
                  >
                      <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                  </button>
                </Tooltip>

                {/* update button */}
                {(getNote !== debouncedNoteInput || getNoteTitle !== debouncedTitleInput) && (!updating || !stateLoading) && (
                  <Tooltip title="Update Note" arrow placement="top">
                    <button
                      type="submit"
                      className={wordCount > 0 ? "h-10 flex justify-center items-center rounded-full px-5 border-[1px] border-[#114f60] dark:border-[#3b8a9e] shadow-lg text-[#114f60] dark:text-[#3b8a9e] hover:text-white hover:bg-[#114f60] dark:hover:bg-[#2d7a8a] dark:hover:text-white hover:border-none transition-all duration-150" : "w-0 h-0 opacity-0 transition-all duration-150"}
                    >
                      {
                        updating || stateLoading ? <span className="loading loading-spinner loading-sm"></span> :
                        <CheckRoundedIcon sx={{ fontSize: 18 }} />
                      }
                    </button>
                  </Tooltip>
                )}

                {/* word count desktop */}
                <Tooltip title={`${wordCount} of ${MAX_NOTE_CHARACTERS} characters used`} arrow placement="top">
                  <span className="hidden lg:block lg:absolute left-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                    <span className={`${wordCount < 20000 ? "text-[#22c55e]" : wordCount < 700 ? "text-[#eab308]" : "text-[#ef4444]"}`}>{wordCount}</span>/
                    {MAX_NOTE_CHARACTERS} characters
                  </span>
                </Tooltip>
              </div>

              {/* word count mobile */}
              <div className="w-full flex lg:hidden items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                  <span className={`${wordCount < 20000 ? "text-[#22c55e]" : wordCount < MAX_NOTE_CHARACTERS ? "text-[#eab308]" : "text-[#ef4444]" }`}>{wordCount}</span>{MAX_NOTE_CHARACTERS} characters
                </span>
              </div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    )
}

export default NoteModal