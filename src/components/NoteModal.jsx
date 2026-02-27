/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from 'react'
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
import { ShareNote } from "./ShareNote";
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion'
import { CircularProgress, Tooltip } from '@mui/material';
import { convertTime } from '../utils/timeConverter';

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

    note_date,
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
        setGetNoteTitle(e.target.value)
    }

    // handle change for form
    const handleChange = (e) => {
        setGetNote(e.target.value)
        setWordCount(e.target.value.length)
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
    

  return (
    
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed w-full h-full top-0 left-0 sm:p-5 md:py-10 flex justify-center items-center z-[70]"
          >
            {/* backdrop */}
            <div className="fixed w-full h-full bg-black/80" onClick={() => handleNav()}></div>

            <div className="w-full h-full lg:w-[90%] xl:w-[60%] md:lg-auto group">
              <motion.form
                onSubmit={handleNoteUpdate}
                className="opacity-100 relative flex flex-col w-full h-full bg-white border sm:rounded-[2rem] shadow-md duration-150 transition-all z-50 overflow-hidden"
              >
                {/* Header Section */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                  <span className={`flex gap-2 flex-row border-[1px] px-2 md:px-4 py-2 rounded-full ${colorOptionValue} text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-600 font-light transition-all duration-150`}>
                    noted on <b className="font-bold">{convertTime(note_date)}</b>
                  </span>

                  <div className="flex gap-2 items-center z-20">
                    
                    <Tooltip title="Pin" placement="bottom" arrow>
                      <button className={`w-8 h-8 flex justify-center items-center border-[1px] cursor-pointer p-1 rounded-full ${noteIsPinned ? "text-[#114f60] bg-[#114f60]/10" : "lg:hover:bg-[#114f60]/10"} rounded-full cursor-pointer transition-all duration-150`} type="button"
                        onClick={() => handlePinUpdate()}
                        disabled={updatingPin || stateLoading}
                      >
                          {updatingPin ? <CircularProgress size="20px" color="inherit"/> : !noteIsPinned ? <PushPinOutlinedIcon/> : <PushPinRoundedIcon />}
                      </button>
                    </Tooltip>

                    <Tooltip title={autoSave == "true" ? "Undo Auto-Save" : "Enable Auto-Save"} placement="bottom" arrow>
                      <button className={`w-8 h-8 flex justify-center items-center border-[1px] ${autoSave == "true" ? "text-[#114f60] bg-[#114f60]/10" : "lg:hover:bg-[#114f60]/10"} rounded-full cursor-pointer transition-all duration-150`} type="button"
                        onClick={() => handleAutoSaveToggle()}
                        disabled={updating || stateLoading}
                      >
                          {updating || stateLoading ? <span className="loading loading-spinner loading-sm"></span> : < UpdateRoundedIcon />}
                      </button>
                    </Tooltip>

                    {/* close button or loading */}
                    <button className="w-8 h-8 border-[1px] hover:bg-black/10 rounded-full transition-all duration-150" type="button"
                      onClick={() => handleNav()}
                      disabled={updating || stateLoading}
                    >
                      <ClearRoundedIcon />
                    </button>
                  </div>

                </div>

                {/* input fields Section */}
                <div className={`relative w-full h-full flex flex-col ${colorOptionValue}`}>
                  {/* Title Field */}
                  <input
                    type="text"
                    name="title"
                    value={getNoteTitle} // Ensure you have a state for the title (e.g., getNoteTitle)
                    onChange={handleTitleChange} // Your title change handler
                    placeholder="Title"
                    className={`w-full outline-none font-bold text-xl md:text-2xl px-4 bg-transparent lg:px-8 py-4 placeholder:text-gray-400 transition-all duration-150`}
                  />

                  {/* Textarea (Note Body) */}
                  <textarea
                    ref={textareaRef}
                    value={getNote}
                    onChange={handleChange}
                    className={`w-full flex-grow outline-none resize-none placeholder:text-gray-400 px-4 lg:px-8 py-4 pb-5 text-base z-30 transition-all duration-150 bg-transparent`}
                    placeholder="Write Note"
                  />
                </div>

                {/* Action Buttons Footer */}
                <div className="relative w-full flex flex-col lg:flex-row justify-center items-center gap-4 py-4 md:py-8">
                  <div className="relative w-full flex justify-center gap-4 items-center px-3 md:px-5">
                    
                    {/* color pallete component */}
                    <ColorPallete show={showColorPallete} colorOption={colorOptionValue} addBackground={handleColorOption} />

                    <Tooltip title="Choose colour" arrow placement="top">
                      <i className={`w-10 h-10 flex justify-center items-center rounded-full ${showColorPallete ? "bg-warning border-none" : "border-[1px] border-black"} hover:bg-warning hover:border-none z-30 transition-all duration-150 cursor-pointer `}
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
                        className={`${wordCount > 0 ? "w-10 h-10 rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-black hover:border-none " : "w-0 h-0 opacity-0"} ${notePrivacy && "bg-black text-white"} flex justify-center items-center transition-all duration-150`}
                        type="submit"
                        onClick={() => setNotePrivacy(!notePrivacy)}
                      >
                        {notePrivacy ? <LockRoundedIcon sx={{ fontSize: 18 }} /> : <LockOpenRoundedIcon sx={{ fontSize: 18 }} />}
                      </button>
                    </Tooltip>

                    {!notePrivacy && <ShareNote title={getNoteTitle} text={getNote} wordCount={wordCount} />}

                    {/* update button */}
                    {(getNote !== debouncedNoteInput || getNoteTitle !== debouncedTitleInput) && (!updating || !stateLoading) && (
                      <Tooltip title="Update Note" arrow placement="top">
                        <button
                          type="submit"
                          className={wordCount > 0 ? "h-10 flex justify-center items-center rounded-full px-5 border-[1px] border-[#114f60] shadow-lg text-[#114f60] hover:text-white hover:bg-[#114f60] hover:border-none transition-all duration-150" : "w-0 h-0 opacity-0 transition-all duration-150"}
                        >
                          {
                            updating || stateLoading ? <span className="loading loading-spinner loading-sm"></span> :
                            <CheckRoundedIcon sx={{ fontSize: 18 }} />
                          }
                        </button>
                      </Tooltip>
                    )}

                    {/* word count desktop */}
                    <span className="hidden lg:block lg:absolute left-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                      {wordCount} characters
                    </span>
                  </div>

                  {/* word count mobile */}
                  <div className="w-full flex lg:hidden items-center justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                      {wordCount} characters
                    </span>
                  </div>
                </div>
              </motion.form>
            </div>
          </motion.div>
  )
}

export default NoteModal