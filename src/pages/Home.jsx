import React, { useContext, useEffect, useRef, useState } from "react"
import useCreateNote from "../hooks/useCreateNote"
import Note from "../components/Note"
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import { useSelector } from "react-redux";
import ColorPallete from "../components/ColorPallete";
import useUpdateNotes from "../hooks/useUpdateNotes";
import SignIn from "./SignIn";
import useGetUser from "../hooks/useGetUser";
import Search from "../components/Search";
import { useDebounce } from "react-use";
import FilterButton from "../components/FilterButton";
import useFetchNotes from "../hooks/useFetchNotes";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import moment from "moment";
import { CopyToClipboard } from "../components/CopyToClipboard";
import usePublicNote from "../hooks/usePublicNote";
import useRequestCollab from "../hooks/useRequestCollab";
import useFetchCollabs from "../hooks/useFetchCollabs";
import Sidebar from "../section/Sidebar";
import { toast } from "react-toastify";

const options = ['privacy', 'date', 'content', 'default']

const Home = () => {

  const [uid, setUid] = useState()
  const [notes, setNotes] = useState()
  const [noteInput, setNoteInput] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState("")
  const [activeNote, setactiveNote] = useState(null)
  const [closeSectionPinned, setCloseSectionPinned] = useState(true)
  const [closeSection, setCloseSection] = useState(false)
  const [showSortOptions, setShowOptions] = useState(false)

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("")
  const [sortValue, setSortValue] = useState("default")
  const [message, setMessage] = useState("")

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  // Accessing notes and user from Redux store
  const stateUser = useSelector((state) => state.app.user)
  const { notes:userNotes, loadingNotes } = useSelector((state) => state.notes)
  const statePublicNote = useSelector((state) => state.publicNote.publicNotes)
  const { collaboration } = useSelector((state) => state.publicNote)

  // Accessing marked notes from AppContext
  const { markedNotes } = useContext(AppContext);

  //  Capture the ID from the URL
  const queryParam = searchParams.get("note");
  const isPublicNote = Array.isArray(statePublicNote) ? statePublicNote?.some((note) => note.id == queryParam && note.user_id !== uid) : null
  const isWriting = queryParam === 'true' && !isPublicNote ? true : false;

  let inputRef = useRef('')

  const { isSuccess } = useGetUser()
  const { mutate, isPending } = useCreateNote()
  const { mutate:updateIndexNums } = useUpdateNotes()
  const { error, isLoading } = useFetchNotes(stateUser?.id, sortValue == 'color' ? 'bg_color' 
    : sortValue == 'content' ? 'data_value' 
    : sortValue == 'date' ? 'created_at' 
    : sortValue == 'privacy' ? 'privacy'
    : 'index_num', debouncedSearchInput)
  

  const { isLoading: loadingPublicNote } = usePublicNote(queryParam)
  const { isPending: loadingCollabs } = useFetchCollabs(uid, queryParam)
  const { mutate: requestCollab, isPending:processingRequest } = useRequestCollab()
  

  // This hook debounces the searchTerm from making a request to the api on every change. Debouncing stalls the request until searchTerm does not change for a number of time 
  useDebounce(() => {
    setDebouncedSearchInput(searchInput)
    if (searchInput !== "") {
      setCloseSectionPinned(false)
      setCloseSection(false)
    } else {
      setCloseSectionPinned(true)
    }
    }, 500, [searchInput]
  )
  
  // close public modal based on isPublicNote
  const closePublicNote = () => {
    navigate(`/`, { replace: true });
  }
   
  // handle navigation base on query param
  const handleNav = () => {
    if (!isWriting && !isPending) {
      navigate(`/?note=true`, { replace: true });
    } else {
      navigate(`/`, { replace: true });
    }
  };

  // Effect to handle body overflow and saving note on form close
  useEffect(() => {
    if (isWriting || isPublicNote) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => e.key === "Escape" && handleNav();
      window.addEventListener("keydown", handleEsc);
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener("keydown", handleEsc);
      };
    }

    // Save note when closing the input form if there is content
    // this is to ensure auto sae and avoiding data loss
    if (!isWriting && noteInput.trim() !== "") {
      saveNote();
    }
  }, [isPublicNote, isWriting]);

  //  Display message if no notes found after 2 seconds
  useEffect(() => {
    if (!isLoading && !loadingPublicNote && !error) {
      setMessage(
        <div className="flex flex-col items-center justify-center text-slate-400">
          <div className="p-6 bg-white rounded-full shadow-sm mb-4">
            <DescriptionIcon sx={{ fontSize: 80, opacity: 0.2 }} />
          </div>
          <p className="text-lg font-medium">Your creative space is empty</p>
          <button 
            onClick={handleNav}
            className="mt-4 text-cyan-700 font-semibold hover:underline"
          >
            Create your first note
          </button>
        </div>
      );
    } else if (error) {
      setMessage(
        <div className="flex flex-col items-center justify-center text-red-400">
          <div className="p-6 bg-red-50 rounded-full mb-4">
            <ErrorOutlineRoundedIcon sx={{ fontSize: 80, opacity: 0.5 }} />
          </div>
          <p className="text-lg font-medium text-slate-600">Failed to load notes</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
  }, []);
  
  // Sync local notes state with Redux store
  useEffect(() => {
    setUid(stateUser?.id)
    if(stateUser !== null) {
      setNotes(userNotes)
    }
  }, [userNotes, stateUser?.id])

  
  // Function to save note
  const saveNote = () => {
    // Do not save empty notes
    if (noteInput.trim() === "") {
      setWordCount(0);
      return;
    }

    // Proceed to save the note
    mutate(
      {
        title: noteTitle,
        data_value: noteInput,
        bg_color: colorOptionValue == "" ? "bg-white" : colorOptionValue,
        index_num: notes.length > 0 ? notes[0].index_num + 2 : 2,
        user_id: uid
      }, {
        onSuccess: () => {
          isWriting && handleNav(); // Close the form only if it was opened for writing

          // Reset state inside onSuccess to ensure data was sent
          setColorOptionValue('')
          setNoteInput("");
          setWordCount(0);
          setShowColorPallete(false);
          toast.success("Note Added Succefully", {
            className: "text-xs w-fit pr-24"
          })
        }
      }
    )
  }

  // request collab handler
  const handleRequestCollab = () => {
    requestCollab({ userId: uid, noteId: queryParam, ownerId: statePublicNote[0].user_id}, {
      onSuccess: (data) => {
        console.log("requested", data)
        toast.success(collaboration == null ? "Requested" : "Canceled", {
          className: "text-xs w-fit pr-24"
        })
      }
    })
  }
  
  // Handle form submission
  const handleNoteAdd = (e) => {
    e.preventDefault();
    saveNote();
  }

  // Check if there are pinned notes
  const checkForPinned = () => {
    const containsPinned = notes.some((note) => note.pinned)
    return containsPinned
  }

  // handle notetile field change
  const handleTitleChange = (e) => {
    setNoteTitle(e.target.value)
  }

  
  // onChange for input field
  const handleChange = (e) => {
    setNoteInput(e.target.value)
    setWordCount(e.target.value.length)
  }


  // Clear input field function
  const clearInput = () => {
    setWordCount(0)
    setNoteInput("")
    setColorOptionValue('')
  }

  // handle colour change
  const handleColorOption = (e) => {
    const getColorValue = (e.target.className).split(" ").filter((x) => /bg-/.test(x))[0]
    setColorOptionValue(getColorValue)
    setShowColorPallete(false)
  }

  // drop function
  const onDrop = (position) => {

    if(activeNote == null || activeNote == undefined) return

    var notesCopy = JSON.parse(JSON.stringify(notes))

    const noteToMove = notes.filter(note => note.index_num == activeNote.index_num)
    const updatedNotes = notes.filter((note) => note.index_num !== activeNote.index_num)
    
    updatedNotes.splice(position, 0, noteToMove[0])
    // const getOtherNote = updatedNotes.slice(position + 1, position + 2);

    // console.log("position", position)
    // console.log("notetomoveindex", notes.indexOf(noteToMove[0]))
    // console.log("note to move", noteToMove)
    // console.log('before manipulation', notesCopy)

    notesCopy[position].index_num = notes[notes.indexOf(noteToMove[0])].index_num
    notesCopy[notes.indexOf(noteToMove[0])].index_num = notes[position].index_num

    // console.log("Notes Copy", notesCopy.sort((a,b) => b.index_num - a.index_num))

    setNotes(notesCopy.sort((a,b) => b.index_num - a.index_num))
    updateIndexNums({
      id_one: notesCopy[position].id, 
      index_two: notesCopy[position].index_num, 
      index_one: notesCopy[notes.indexOf(noteToMove[0])].index_num,
      id_two: notesCopy[notes.indexOf(noteToMove[0])].id, 
    })
  }

  if(error) return  <h3>Error: {error}</h3>
  
  if (stateUser == null && !isPublicNote) {
    return <SignIn />
  } else if (isPublicNote) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className={"fixed w-full h-full top-0 left-0 p-5 md:py-10 flex justify-center items-center z-[70]"}>

          {/* backdrop  */}
          <div className={"fixed w-full h-full bg-black/40 backdrop-blur-sm"} onClick={closePublicNote}></div>

          <div className="w-full h-full md:w-[80%] lg:w-[60%] md:lg-auto group">
            <motion.form
              // layoutId={`note-${noteId}`}
              // onSubmit={handleNoteUpdate} 
              className={`opacity-100 relative flex flex-col w-full h-full pb-2 bg-white border justify-between rounded-[2rem] shadow-md duration-150 transition-all z-50`}>

              <div className="flex items-center justify-end gap-2 px-2 py-2">
                <span className={`flex gap-2 flex-row border-[1px] px-4 py-2 rounded-full ${statePublicNote[0].bg_color} text-[10px] uppercase tracking-wider text-gray-600 font-light transition-all duration-150`}>noted on <b className="font-bold">{moment(statePublicNote[0].created_at).format("Do MMMM, YYYY")}</b></span>
                
                {/* close button or loading  */}
                {
                  loadingPublicNote ? <span className="loading loading-spinner loading-sm"></span> :
                  <button className={"w-8 h-8 z-20 border-[1px] hover:bg-black/10 rounded-full transition-all duration-300"} type="button" onClick={closePublicNote}><ClearRoundedIcon /></button>
                }
              </div>

              {/* textarea  */}
              <textarea
                autoFocus
                type="text" 
                value={statePublicNote[0].data_value}
                disabled
                className={`w-full h-[90%] outline-none resize-none placeholder:text-black px-8 py-4 text-base rounded-lg z-30 transition-all duration-300`} placeholder="Write Note"/>

              {/* action buttons  */}
              <div className="relative w-full md:flex justify-center items-center py-10">
                  <div className={`relative w-full flex justify-center gap-4 items-center px-3 md:px-5 pt-4`}>
                    {/* copy text to clipboard  */}
                    <CopyToClipboard text={statePublicNote[0]?.data_value} wordCount={statePublicNote[0]?.data_value.length} />
                    
                    {
                      uid && 
                      <>

                        {
                          processingRequest || loadingCollabs ?
                              <span className="loading loading-spinner loading-sm"></span>
                          :
                            <Tooltip title={ collaboration !== null ? "Cancel Request" : "Request Collaboration" } arrow placement="top">
                              <button className={`w-10 h-10 flex justify-center items-center rounded-full top-2 right-2 px-2 py-2 border-[1px] border-black shadow-lg ${collaboration ? "bg-[#FF8C00] text-white border-none" : "hover:bg-[#FF8C00] hover:text-white hover:border-none"} transition-all duration-300`} type="button" onClick={handleRequestCollab}><GroupAddRoundedIcon sx={{ fontSize: 18 }}/></button>
                            </Tooltip>
                        }
                      </>
                    }
                  
                    {/* word count  */}
                    <span className="hidden md:block md:absolute left-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                      {statePublicNote[0].data_value.length} characters
                    </span>
                  </div>
                        
                      {/* word count  */}
                      <span className="w-full md:hidden absolute text-center bottom-[4px] text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                        {statePublicNote[0].data_value.length} characters
                      </span>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  } else {
    if (userNotes !== null && isSuccess) return (
      <div className="relative w-full flex flex-col gap-5 px-3 py-5 md:px-10 lg:px-20 md:py-10 justify-center items-center overflow-scroll">

          {/* side bar  */}
          {/* <Sidebar /> */}
        
          {/* Main section of Homepage  */}
          <section className="relative w-full flex flex-col gap-4 justify-center items-center">
            <div className="flex justify-center items-center flex-row-reverse gap-2 lg:gap-6 w-full my-2 md:my-8">
              <Search 
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
              <FilterButton 
                options={options}
                sortValue={sortValue}
                showSortOptions={showSortOptions}
                setSortValue={setSortValue}
                setShowOptions={setShowOptions}
              />
            </div>

            {userNotes !== null && !isLoading && notes?.length > 0 ?
              <div className="w-full gap-2 flex flex-col items-center justify-center">
                <div className="w-full flex flex-col gap-5">
                  
                  {
                    checkForPinned() &&
                    <>
                      <Tooltip title={closeSectionPinned ? "Open Pinned" : "Close Pinned"} className={ `${notes.length > 1 ? "block" : "hidden"}`} arrow placement='top'>
                        <button className={`w-fit flex justify-center items-center ${!closeSectionPinned ? 'bg-[#f4f7f8] text-[#255f6f] border-[#255f6f]/20' : 'bg-white'} border-[1px] border-gray-500/20 pr-4 rounded-full z-40`} onClick={() => setCloseSectionPinned(!closeSectionPinned)}>
                          <p className={`${!closeSectionPinned && "-rotate-180"} cursor-pointer duration-300`}>{closeSectionPinned ? <ArrowDropDownRoundedIcon fontSize="large" /> : <ArrowDropDownIcon fontSize="large" />}</p>
                          <h2 className="uppercase text-center text-xs font-medium tracking-wide">pinned notes</h2>
                        </button>
                      </Tooltip>
                    
                      <div className={`${closeSectionPinned ? "hidden" : "block"} rounded-md p-1 sm:p-4 w-full gap-1 sm:gap-2 md:gap-4 columns-2 md:columns-3 lg:columns-4 space-y-1 sm:space-y-2 md:space-y-4 mx-auto`}>
                        {
                          notes?.map((note) => (
                                note.pinned && <React.Fragment key={note.id}>
                                  <Note 
                                    title={note.title}
                                    noteId={note.id}
                                    note={note.data_value}
                                    note_date={note.created_at}
                                    note_privacy={note.privacy}
                                    bgColor={note.bg_color}
                                    updateId={note.id}
                                    draggedNote={note}
                                    activeNote={setactiveNote}
                                    handleDrop={() => onDrop(notes.indexOf(note))}
                                  />
                                </React.Fragment>
                              )
                            )
                        }
                      </div>
                    </>
                  }

                </div>

                <div className="w-full flex flex-col gap-5">
                  
                  {
                      (checkForPinned() && notes.some((note) => !note.pinned)) &&
                      <Tooltip title={closeSection ? "Open Notes" : "Close notes"} arrow placement='top'>
                        <button className={`w-fit flex justify-center items-center ${!closeSection ? 'bg-[#f4f7f8] text-[#255f6f] border-[#255f6f]/20' : 'bg-white'} border-[1px] border-gray-500/20 pr-4 rounded-full z-40`} onClick={() => setCloseSection(!closeSection)}>
                          <p className={`${!closeSection && "-rotate-180"} cursor-pointer duration-300`}>{closeSection ? <ArrowDropDownRoundedIcon fontSize="large" /> : <ArrowDropDownIcon fontSize="large" />}</p>
                          <h2 className="uppercase text-center text-xs font-medium tracking-wide">other notes</h2>
                        </button>
                      </Tooltip>
                  }
                  
                  { notes.some((note) => !note.pinned) &&
                    <div className={`${closeSection ? "hidden" : "block"} rounded-md p-1 sm:p-4 w-full gap-1 sm:gap-2 md:gap-4 columns-2 md:columns-3 lg:columns-4 space-y-1 sm:space-y-2 md:space-y-4 mx-auto`}>
                      
                      {
                        notes?.map((note) => (
                          !note.pinned &&
                            <React.Fragment key={note.id}>
                              <Note 
                                title={note.title}
                                noteId={note.id}
                                note={note.data_value}
                                note_date={note.created_at}
                                note_privacy={note.privacy}
                                bgColor={note.bg_color}
                                updateId={note.id}
                                draggedNote={note}
                                activeNote={setactiveNote}
                                handleDrop={() => onDrop(notes.indexOf(note))}
                              />
                              </React.Fragment>
                          )
                        )
                      }
                    </div>
                  }

                </div>
              </div> : 
              <div className="py-20 w-full flex justify-center items-center">
                { isLoading || loadingNotes ? 
                  // loading 
                  <div className="flex flex-col py-20 items-center justify-center text-[#255f6f]">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="text-lg font-light">Loading notes</p>
                  </div> : message
                }
              </div>
            }
          </section>

          {/* Add Note Section */}

          <AnimatePresence>
            {isWriting && !isPublicNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed w-full h-full top-0 left-0 p-5 md:py-10 flex justify-center items-center z-[70]"
              >
                {/* backdrop */}
                <div className="fixed w-full h-full bg-black/40 backdrop-blur-sm" onClick={handleNav}></div>

                <div className="w-full h-full md:w-[80%] lg:w-[60%] md:lg-auto group">
                  <form
                    onSubmit={handleNoteAdd}
                    className={`opacity-100 relative flex flex-col w-full h-full bg-white border rounded-[2rem] shadow-md duration-150 transition-all z-50 overflow-hidden`}
                  >
                    {/* Header Actions */}
                    <div className="flex items-center justify-end p-4">
                      <button
                        className="w-8 h-8 z-20 border-[1px] hover:bg-black/10 rounded-full transition-all duration-300"
                        type="button"
                        onClick={handleNav}
                      >
                        <ClearRoundedIcon />
                      </button>
                    </div>

                    {/* Title Field */}
                    <div className="px-8">
                      <input
                        type="text"
                        name="title"
                        value={noteTitle} // Ensure this state exists
                        onChange={handleTitleChange} // Ensure this handler exists
                        placeholder="Title"
                        maxLength="100"
                        className={`w-full outline-none font-bold text-xl md:text-2xl pb-2 ${colorOptionValue} placeholder:text-gray-400 transition-all duration-300`}
                      />
                    </div>

                    {/* Note Body Field */}
                    <textarea
                      ref={inputRef}
                      autoFocus
                      value={noteInput}
                      onChange={handleChange}
                      className={`w-full flex-grow outline-none resize-none ${colorOptionValue} px-8 py-4 placeholder:text-gray-400 text-base z-30 transition-all duration-300`}
                      placeholder="Write Note"
                    />

                    {/* Footer Actions */}
                    <div className="relative w-full md:flex justify-center items-center py-6">
                      {isPending ? (
                        <div className="w-full flex justify-center items-center px-3 md:px-5 pt-4 transition-all duration-150">
                          <span className="loading loading-spinner loading-sm"></span>
                        </div>
                      ) : (
                        <div
                          className={`w-full flex justify-center ${
                            wordCount > 0 ? "gap-4" : "gap-0"
                          } items-center px-3 md:px-5 transition-all duration-150`}
                        >
                          {/* color palette */}
                          <ColorPallete
                            show={showColorPallete}
                            colorOption={colorOptionValue}
                            addBackground={handleColorOption}
                          />
                          <Tooltip title="Choose color" arrow>
                            <i
                              className={`flex justify-center items-center ${
                                wordCount > 0 ? "w-10 h-10 rounded-full" : "w-0 h-0 opacity-0"
                              } ${
                                showColorPallete
                                  ? "bg-warning shadow-lg border-none"
                                  : "border-[1px] border-neutral"
                              } hover:bg-warning hover:border-none z-30 transition-all duration-200 cursor-pointer`}
                              onClick={() => setShowColorPallete(!showColorPallete)}
                            >
                              <ColorLensRoundedIcon sx={{ fontSize: 18 }} />
                            </i>
                          </Tooltip>

                          {/* Clear all text */}
                          <Tooltip title="Clear Note" arrow>
                            <button
                              className={
                                wordCount > 0
                                  ? "w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-red-500 hover:border-none transition-all duration-300"
                                  : "w-0 h-0 opacity-0 transition-all duration-200"
                              }
                              type="button"
                              onClick={clearInput}
                            >
                              <ClearAllRoundedIcon />
                            </button>
                          </Tooltip>

                          {/* add note */}
                          <Tooltip title="Add Note" arrow>
                            <button
                              type="submit"
                              className={
                                wordCount > 0
                                  ? "h-10 flex justify-center items-center rounded-full px-5 border-[1px] border-[#114f60] shadow-lg text-[#114f60] hover:text-white hover:bg-[#114f60] hover:border-none transition-all duration-300"
                                  : "w-0 h-0 opacity-0 transition-all duration-200"
                              }
                            >
                              <CheckRoundedIcon />
                            </button>
                          </Tooltip>

                          {/* Word count desktop */}
                          <span className="hidden lg:block lg:absolute left-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                            {wordCount} characters
                          </span>
                        </div>
                      )}

                      {/* word count mobile */}
                      <span className="w-full lg:hidden absolute text-center bottom-[4px] text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                        {wordCount} characters
                      </span>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Noet Button */}
            <Tooltip title="Add Noet" arrow placement="top"  className={`${markedNotes.length > 0 ? "opacity-0" : "opacity-100"} fixed bottom-4 md:bottom-10 right-10 lg:right-12 duration-300 transition-all z-30`}>
                <button type="submit" className="cursor-pointer flex justify-center items-center rounded-full shadow-lg text-white text-sm font-bold bg-[#114f60] hover:bg-[#255f6f] px-4 py-4 transition-all duration-300 z-30" onClick={handleNav} disabled={markedNotes.length > 0}> 
                  <AddRoundedIcon sx={{ fontSize: 20 }}/> 
                  Add Note
                </button>
            </Tooltip>

      </div>
    ) 
  }
  

}

export default Home