import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import useCreateNote from "../hooks/useCreateNote"
import Note from "../components/Note"
import LoadSentinel from "../components/LoadSentinel"
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutline';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
// import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import { useSelector } from "react-redux";
import ColorPallete from "../components/ColorPallete";
import useUpdateNotes from "../hooks/useUpdateNotes";
import SignIn from "./SignIn";
import useGetUser from "../hooks/useGetUser";
import Search from "../components/Search";
import { useDebounce } from "react-use";
import FilterButton from "../components/FilterButton";
import useInfinitePinnedNotes from "../hooks/useInfinitePinnedNotes";
import useInfiniteUnpinnedNotes from "../hooks/useInfiniteUnpinnedNotes";
import useNoteById from "../hooks/useNoteById";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import moment from "moment";
import { CopyToClipboard } from "../components/CopyToClipboard";
import usePublicNote from "../hooks/usePublicNote";
// import useRequestCollab from "../hooks/useRequestCollab";
// import useFetchCollabs from "../hooks/useFetchCollabs";
// import Sidebar from "../section/Sidebar";
import { toast } from "react-toastify";
import { ShareNote } from "../components/ShareNote";
import NoteModal from "../components/NoteModal";
import useUpdateNote from "../hooks/useUpdateNote";
import usePin from "../hooks/usePin";
import { getColor } from "../utils/getColor";
import { verifyColorIsWhite } from "../utils/verifyColorIsWhite";
import { useTheme } from "../context/ThemeContext";

const options = ['privacy', 'date', 'content', 'default']

const Home = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const MAX_TITLE_WORDS = 15;
  const MAX_NOTE_CHARACTERS = 30000;

  const [uid, setUid] = useState()
  const [noteInput, setNoteInput] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [titleWordsCount, setTitleWordsCount] = useState(noteTitle.trim().split(/\s+/).length || 0);
  const [wordCount, setWordCount] = useState(0)
  const [wordStore, setWordStore] = useState("")
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState("")
  const [activeNote, setactiveNote] = useState(null)
  const [closeSectionPinned, setCloseSectionPinned] = useState(true)
  const [closeSection, setCloseSection] = useState(false)
  const userToggledPinnedRef = useRef(false)
  const userToggledUnpinnedRef = useRef(false)
  const [showSortOptions, setShowOptions] = useState(false)

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("")
  const [sortValue, setSortValue] = useState("default")
  const [message, setMessage] = useState("")
  const [isSearchLoading, setIsSearchLoading] = useState(false)
    
  const [expand, setExpand] = useState(false)

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  // Accessing user from Redux store
  const stateUser = useSelector((state) => state.app.user)
  const stateLoggedIn = useSelector((state) => state.app.loggedIn)
  const statePublicNote = useSelector((state) => state.publicNote.publicNotes)
  // const { collaboration } = useSelector((state) => state.publicNote)

  // Accessing marked notes from AppContext
  const { markedNotes } = useContext(AppContext);

  //  Capture the ID from the URL
  const queryParam = searchParams.get("note");
  const isPublicNote = Array.isArray(statePublicNote) ? statePublicNote?.some((note) => note.id == queryParam && note.user_id !== uid) : null
  const isWriting = queryParam === 'open' && !isPublicNote ? true : false;

  let inputRef = useRef('')

  const queryClient = useQueryClient()
  const { isSuccess } = useGetUser()
  const { mutate, isPending } = useCreateNote()
  const { mutate:updateIndexNums } = useUpdateNotes()

  // Determine the sort filter based on sortValue
  const sortFilter = sortValue == 'color' ? 'bg_color' 
    : sortValue == 'content' ? 'data_value' 
    : sortValue == 'date' ? 'created_at' 
    : sortValue == 'privacy' ? 'privacy'
    : 'index_num'

  // Use infinite queries for pinned and unpinned notes
  const pinnedNotesQuery = useInfinitePinnedNotes(sortFilter, debouncedSearchInput)
  const unpinnedNotesQuery = useInfiniteUnpinnedNotes(sortFilter, debouncedSearchInput)

  // Flatten all pages into single arrays with proper null checks
  const allPinnedNotes = useMemo(() => 
    pinnedNotesQuery.data?.pages?.flatMap(page => page?.notes)?.filter(Boolean) || [],
    [pinnedNotesQuery.data]
  )
  const allUnpinnedNotes = useMemo(() => 
    unpinnedNotesQuery.data?.pages?.flatMap(page => page?.notes)?.filter(Boolean) || [],
    [unpinnedNotesQuery.data]
  )

  // Combined notes array for local state management
  const combinedNotes = useMemo(() => [...allPinnedNotes, ...allUnpinnedNotes], [allPinnedNotes, allUnpinnedNotes])

  // Loading and error states
  const isLoading = pinnedNotesQuery.isLoading || unpinnedNotesQuery.isLoading
  const error = pinnedNotesQuery.error || unpinnedNotesQuery.error

  const { isLoading: loadingPublicNote } = usePublicNote(queryParam)
  // const { isPending: loadingCollabs } = useFetchCollabs(uid, queryParam)
  // const { mutate: requestCollab, isPending: processingRequest } = useRequestCollab()
  
  // Fetch note by ID when URL param is present and note is not in loaded notes
  const noteInCombinedNotes = useMemo(() => 
    combinedNotes?.find(note => note.id == queryParam),
    [combinedNotes, queryParam]
  );
  
  // Only fetch by ID if queryParam exists, is not a public note, is not 'open', and note is not in loaded notes
  const shouldFetchById = queryParam && !isPublicNote && queryParam !== 'open' && !noteInCombinedNotes;
  const { data: fetchedNote } = useNoteById(shouldFetchById ? queryParam : null);
  
  // State for opening a note directly via URL (when note wasn't loaded via infinite scroll)
  const [directNoteData, setDirectNoteData] = useState(null);
  const isDirectNoteOpen = !!directNoteData;
  
  // Effect to handle opening note when fetched by ID
  useEffect(() => {
    if (fetchedNote && !isDirectNoteOpen) {
      setDirectNoteData(fetchedNote);
    }
  }, [fetchedNote, isDirectNoteOpen]);
  
  // Handler for closing direct note modal
  const handleDirectNoteClose = useCallback(() => {
    setDirectNoteData(null);
    navigate(`/`, { replace: true });
  }, [navigate]);
  
  // Effect to handle body overflow for direct note modal
  useEffect(() => {
    if (isDirectNoteOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => e.key === "Escape" && handleDirectNoteClose();
      window.addEventListener("keydown", handleEsc);
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isDirectNoteOpen, handleDirectNoteClose]);

  // Get loading state from Redux
  const stateLoading = useSelector((state) => state.app.isLoading);
  
  // Hooks for direct note operations (called at component level)
  const directNoteUpdateMutation = useUpdateNote();
  const directNotePinMutation = usePin();
  
  // State for direct note modal
  const [directNoteContent, setDirectNoteContent] = useState("");
  const [directNoteTitle, setDirectNoteTitle] = useState("");
  const [directWordCount, setDirectWordCount] = useState(0);
  const [directWordStore, setDirectWordStore] = useState("");
  const [directShowColorPallete, setDirectShowColorPallete] = useState(false);
  const [directColorOption, setDirectColorOption] = useState("");
  const [directNotePrivacy, setDirectNotePrivacy] = useState(false);
  const [directDebouncedNote, setDirectDebouncedNote] = useState("");
  const [directDebouncedTitle, setDirectDebouncedTitle] = useState("");
  const [directDebouncedColorOption, setDirectDebouncedColorOption] = useState("");
  const [directDebouncedNotePrivacy, setDirectDebouncedNotePrivacy] = useState(false);
  
  // Effect to initialize direct note modal state when note is fetched
  useEffect(() => {
    if (directNoteData) {
      setDirectNoteContent(directNoteData.data_value || "");
      setDirectNoteTitle(directNoteData.title || "");
      setDirectWordCount((directNoteData.data_value || "").length);
      setDirectColorOption(directNoteData.bg_color || "bg-white");
      setDirectNotePrivacy(directNoteData.privacy || false);
    }
  }, [directNoteData]);
  
  // Direct note update handler
  const handleDirectNoteUpdate = useCallback((title, input, color, privacy) => {
    directNoteUpdateMutation.mutate({ 
      id: directNoteData.id, 
      title, 
      data_value: input.trim(), 
      bg_color: color, 
      privacy: privacy, 
      updated_at: new Date() 
    });
  }, [directNoteData, directNoteUpdateMutation]);

  // Direct note pin handler
  const handleDirectNotePin = useCallback(() => {
    directNotePinMutation.mutate({ pinned: !directNoteData.pinned, id: directNoteData.id });
    // Update local state
    setDirectNoteData(prev => ({ ...prev, pinned: !prev.pinned }));
  }, [directNoteData, directNotePinMutation]);
  
  // Get autoSave setting from AppContext
  const { autoSave } = useContext(AppContext);
  
  // Autosave for direct note modal - debounces changes and saves after 1.5 seconds
  useDebounce(() => {
    if (
      directNoteContent && 
      isDirectNoteOpen && 
      (directNoteContent !== directDebouncedNote || 
       directNoteTitle !== directDebouncedTitle || 
       directColorOption !== directDebouncedColorOption || 
       directNotePrivacy !== directDebouncedNotePrivacy) && 
      autoSave == "true" && 
      !directNoteUpdateMutation.isPending && 
      !stateLoading
    ) {
      handleDirectNoteUpdate(directNoteTitle, directNoteContent, directColorOption, directNotePrivacy);
      setDirectDebouncedTitle(directNoteTitle);
      setDirectDebouncedNote(directNoteContent);
      setDirectDebouncedColorOption(directColorOption);
      setDirectDebouncedNotePrivacy(directNotePrivacy);
    }
  }, 1500, [directNoteTitle, directNoteContent, directColorOption, directNotePrivacy, isDirectNoteOpen, autoSave]);
  
  // get textArea DOM by ref
  const textareaRef = useRef(null);

  const checkIsPinned = useCallback((id) => {
    const findNote = combinedNotes?.some((note) => note.pinned && note.id == id)
    return findNote;
  }, [combinedNotes])

  useEffect(() => {
    // check if editing 
    if (isPublicNote && textareaRef.current) {
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
  }, [isPublicNote]);

  useEffect(() => {
    // Only auto-open pinned section based on queryParam if user hasn't manually toggled
    if (!userToggledPinnedRef.current) {
      if (queryParam !== null && checkIsPinned(queryParam)) {
        setCloseSectionPinned(false)
      } else {
        setCloseSectionPinned(true)
      }
    }
  }, [queryParam, checkIsPinned])
  

  // This hook debounces the searchTerm from making a request to the api on every change. Debouncing stalls the request until searchTerm does not change for a number of time 
  useDebounce(() => {
    setDebouncedSearchInput(searchInput)
    if (searchInput !== "") {
      // Reset user toggle flags when search changes
      userToggledPinnedRef.current = false
      userToggledUnpinnedRef.current = false
      setCloseSectionPinned(false)
      setCloseSection(false)
      // Start loading spinner for search
      setIsSearchLoading(true)
    } else {
      // Reset user toggle flags when search clears
      userToggledPinnedRef.current = false
      userToggledUnpinnedRef.current = false
      setCloseSectionPinned(true)
      // Stop loading spinner when search is cleared
      setIsSearchLoading(false)
    }
    }, 500, [searchInput]
  )

  // Stop loading spinner when search data arrives
  useEffect(() => {
    if (!pinnedNotesQuery.isFetching && !unpinnedNotesQuery.isFetching && isSearchLoading) {
      setIsSearchLoading(false)
    }
  }, [pinnedNotesQuery.isFetching, unpinnedNotesQuery.isFetching, isSearchLoading])
  
  // Helper to get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage < 0.6) return '#22c55e'; // green
    if (percentage < 0.9) return '#eab308'; // yellow
    return '#ef4444'; // red
  }
  
  // Circular progress component for title word count
  const TitleWordProgress = () => {
    const percentage = Math.min(titleWordsCount / MAX_TITLE_WORDS, 1);
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
  
  // close public modal based on isPublicNote
  const closePublicNote = () => {
    navigate(`/`, { replace: false });
  }
   
  // handle navigation base on query param
  const handleNav = useCallback(() => {
    if (!isWriting && !isPending) {
      navigate(`/?note=open`, { replace: true });
    } else {
      navigate(`/`, { replace: true });
    }
  }, [isWriting, isPending, navigate]);

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

  // Display message based on loading and error states
  useEffect(() => {
    if (isLoading || loadingPublicNote) {
      // Clear message while loading
      setMessage("");
    } else if (error) {
      // Show error message
      setMessage(
        <div className="flex flex-col items-center justify-center text-red-400">
          <div className="p-6 rounded-full mb-4">
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
    } else if (!isLoading && !loadingPublicNote && !error) {
      // Check if searching with no results
      if (debouncedSearchInput && combinedNotes?.length === 0) {
        setMessage(
          <div className="flex flex-col items-center justify-center text-slate-400">
            <div className="p-6 bg-white rounded-full shadow-sm mb-4">
              <DescriptionIcon sx={{ fontSize: 80, opacity: 0.2 }} />
            </div>
            <p className="text-lg font-medium">No notes found matching &ldquo;<span className="font-semibold text-slate-600">{debouncedSearchInput}</span>&rdquo;</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        );
      } else {
        // Show empty state when not loading and no error
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
      }
    }
  }, [isLoading, loadingPublicNote, error, handleNav, debouncedSearchInput, combinedNotes?.length]);
  
  // Update uid when user changes
  useEffect(() => {
    setUid(stateUser?.id)
  }, [stateUser?.id])

  // Display toast notification on successful sign in
  useEffect(() => {
    if (stateLoggedIn && stateUser !== null) {
        toast.success("Signed In Successfully!", {
          className: "text-xs w-fit pr-24"
        })
    }
  }, [stateLoggedIn, stateUser])
  
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
        index_num: allUnpinnedNotes.length > 0 ? allUnpinnedNotes[0].index_num + 2 : 2,
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
  // const handleRequestCollab = () => {
  //   requestCollab({ userId: uid, noteId: queryParam, ownerId: statePublicNote[0].user_id}, {
  //     onSuccess: (data) => {
  //       console.log("requested", data)
  //       toast.success(collaboration == null ? "Requested" : "Canceled", {
  //         className: "text-xs w-fit pr-24"
  //       })
  //     }
  //   })
  // }
  
  // Handle form submission
  const handleNoteAdd = (e) => {
    e.preventDefault();
    saveNote();
  }

  // handle notetile field change
  const handleTitleChange = (e) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    if (wordCount > MAX_TITLE_WORDS) {
      // Truncate to 50 words
      const truncatedTitle = words.slice(0, MAX_TITLE_WORDS).join(' ');
      setNoteTitle(truncatedTitle);
      setTitleWordsCount(MAX_TITLE_WORDS);
      toast.warning(`Title limited to ${MAX_TITLE_WORDS} words`, {
        className: "text-xs w-fit"
      });
    } else {
      setNoteTitle(value);
      setTitleWordsCount(wordCount);
    }
    setNoteTitle(e.target.value)
  }

  
  // onChange for input field
  const handleChange = (e) => {
    // handle words longer than MAX_NOTE_CHARACTERS
    const value = e.target.value;
    const characters = value.length;

    if (characters > MAX_NOTE_CHARACTERS) {
      setNoteInput(e.target.value.slice(0, MAX_NOTE_CHARACTERS))
      setWordCount(MAX_NOTE_CHARACTERS)
      setWordStore("")
      // toast.warning(`Note limited to ${MAX_NOTE_CHARACTERS} characters`, {
      //   className: "text-xs w-fit"
      // })
      return;
    }

    setNoteInput(e.target.value)
    setWordCount(e.target.value.length)
    setWordStore("")
  }


  // Clear input field function
  const clearInput = () => {
    setWordStore(noteInput)
    setWordCount(0)
    setNoteInput("")
    setColorOptionValue("")
  }

  // revert input field function to restore cleared text
  const revertInput = () => {
    setNoteInput(wordStore)
    setWordCount(wordStore.length)
    setWordStore("")
  }

  // handle colour change
  const handleColorOption = (color) => {
    setColorOptionValue(color)
    setShowColorPallete(false)
  }

  // drop function - works with section-specific arrays and updates React Query cache
  const onDrop = (position, sectionNotes, isPinned) => {

    if (!activeNote) return;

    // Find the note to move in the section array
    const noteToMove = sectionNotes.find(note => note.index_num == activeNote.index_num)
    if (!noteToMove) return;

    // Get the current position of the note being dragged
    const currentPosition = sectionNotes.findIndex(note => note.index_num == activeNote.index_num)
    
    // Create a copy and swap positions
    const notesCopy = JSON.parse(JSON.stringify(sectionNotes))
    
    // Swap the index_num values between the two notes
    const targetNote = notesCopy[position]
    const tempIndex = notesCopy[currentPosition].index_num
    
    notesCopy[currentPosition].index_num = targetNote.index_num
    notesCopy[position].index_num = tempIndex

    // Sort by index_num descending
    const sortedNotes = notesCopy.sort((a, b) => b.index_num - a.index_num)
    
    // Update React Query cache immediately for instant UI feedback
    const queryKey = isPinned 
      ? ['pinnedNotes', stateUser?.id, sortFilter, debouncedSearchInput]
      : ['unpinnedNotes', stateUser?.id, sortFilter, debouncedSearchInput]
    
    queryClient.setQueryData(queryKey, (oldData) => {
      if (!oldData) return oldData
      
      // Update the first page with the sorted notes
      const updatedPages = [{
        notes: sortedNotes,
        nextCursor: oldData.pages[0]?.nextCursor
      }, ...oldData.pages.slice(1)]
      
      return { ...oldData, pages: updatedPages }
    })
    
    // Update on server
    updateIndexNums({
      id_one: notesCopy[position].id, 
      index_two: notesCopy[position].index_num, 
      index_one: notesCopy[currentPosition].index_num,
      id_two: notesCopy[currentPosition].id, 
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
          className={`fixed w-full h-full top-0 left-0 sm:p-5 md:py-10 flex ${statePublicNote[0].bg_color} justify-center items-center z-[70]`}>

          {/* backdrop  */}
          <div className={"fixed w-full h-full bg-black/80"} onClick={closePublicNote}></div>

          <div className="w-full h-full lg:w-[90%] xl:w-[60%] md:lg-auto group">
            <motion.form
              // layoutId={`note-${noteId}`}
              // onSubmit={handleNoteUpdate} 
              className={`opacity-100 relative flex flex-col w-full h-full border ${statePublicNote[0].bg_color} sm:rounded-[2rem] shadow-md duration-150 transition-all z-50 overflow-hidden`}>

              {/* input fields Section */}
              <div className={`relative w-full h-full flex flex-col ${statePublicNote[0].bg_color}`}>
                <div className="flex justify-between items-center  px-4 md:px-8 py-4">
                  {/* Title Field */}
                  {statePublicNote[0].title !== "" && 
                    
                    <input
                      type="text"
                      name="title"
                      value={statePublicNote[0].title}
                      className={`w-full outline-none font-bold text-xl md:text-2xl line-clamp-1 [unicode-bidi:plaintext] text-start ltr bg-transparent`}
                      dir="auto"
                      disabled
                      readOnly
                    />
                  }

                  {/* close button or loading  */}
                  {
                    loadingPublicNote ? <span className="loading loading-spinner loading-sm"></span> :
                    <button className={"w-8 h-8 z-20 border-[1px] hover:bg-black/10 rounded-full transition-all duration-150"} type="button" onClick={closePublicNote}><ClearRoundedIcon /></button>
                  }
                </div>

                {/* textarea  */}
                <textarea
                  autoFocus
                  type="text" 
                  // ref={textareaRef}
                  value={statePublicNote[0].data_value}
                  disabled
                  readOnly
                  className={`w-full flex-grow outline-none resize-none placeholder:text-black px-4 md:px-8 py-4 pb-5 text-base [unicode-bidi:plaintext] text-start ltr z-30 transition-all duration-150 bg-transparent`}
                  dir="auto"
                />
              </div>

              {/* action buttons  */}
              <div className="relative w-full flex flex-col justify-center items-center gap-4 py-4 md:py-8">
                  
                  <div className={`relative w-full flex justify-center gap-4 items-center px-3 md:px-5`}>
                    {/* copy text to clipboard  */}
                    <CopyToClipboard text={statePublicNote[0]?.data_value} wordCount={statePublicNote[0]?.data_value.length} />
                    
                    {/* {
                      uid && 
                      <>

                        {
                          processingRequest || loadingCollabs ?
                              <span className="loading loading-spinner loading-sm"></span>
                          :
                            <Tooltip title={ collaboration !== null ? "Cancel Request" : "Request Collaboration" } arrow placement="top">
                              <button className={`w-10 h-10 flex justify-center items-center rounded-full top-2 right-2 px-2 py-2 border-[1px] border-black shadow-lg ${collaboration ? "bg-[#FF8C00] text-white border-none" : "hover:bg-[#FF8C00] hover:text-white hover:border-none"} transition-all duration-150`} type="button" onClick={handleRequestCollab}><GroupAddRoundedIcon sx={{ fontSize: 18 }}/></button>
                            </Tooltip>
                        }
                      </>
                    } */}
                    <ShareNote title={statePublicNote[0].title} text={statePublicNote[0].data_value} wordCount={statePublicNote[0].data_value.length} />
                  </div>
                  
                  <div className="flex w-full justify-between items-center px-3 md:px-5">
                    <span className={`flex gap-2 flex-row border-[1px] md:px-4 uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-light`}>noted on <b className="font-bold">{moment(statePublicNote[0].created_at).format("Do MMMM, YYYY")}</b></span>
                    {/* word count  */}
                    <span className="tflex gap-2 flex-row border-[1px] md:px-4 uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold">
                      {statePublicNote[0].data_value.length} characters
                    </span>
                  </div>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  } else {
    if (combinedNotes !== null && isSuccess) return (
      <div className="relative w-full flex flex-col gap-5 px-3 py-5 md:px-10 lg:px-20 md:py-10 justify-center items-center overflow-scroll">

          {/* Main section of Homepage  */}
          <section className="relative w-full flex flex-col gap-4 justify-center items-center">
            <div className="flex gap-2 lg:gap-6 w-full my-2 md:my-8">
              <FilterButton 
                options={options}
                sortValue={sortValue}
                showSortOptions={showSortOptions}
                setSortValue={setSortValue}
                setShowOptions={setShowOptions}
              />
              <Search 
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                isSearching={isSearchLoading}
              />
            </div>

            {combinedNotes !== null && !isLoading && combinedNotes?.length > 0 ?
              <div className="w-full gap-2 flex flex-col items-center justify-center">
                <div className="w-full flex flex-col gap-5">
                  
                  {
                    combinedNotes.some((note) => note.pinned) &&
                    <>
                      <Tooltip title={closeSectionPinned ? "Open Pinned" : "Close Pinned"} className={ `${combinedNotes.length > 1 ? "block" : "hidden"}`} arrow placement='top'>
                        <button className={`w-fit flex justify-center items-center ${!closeSectionPinned ? (isDark ? 'bg-dark-border text-dark-text' : 'bg-[#f4f7f8] text-[#255f6f]') : (isDark ? 'bg-dark-surface text-dark-text border border-dark-border' : 'bg-white')} border-[1px] ${isDark ? 'border-dark-border' : 'border-gray-500/20'} pr-4 rounded-full z-40`} onClick={() => {
                          userToggledPinnedRef.current = true
                          setCloseSectionPinned(!closeSectionPinned)
                        }}>
                          <p className={`${!closeSectionPinned && "-rotate-180"} cursor-pointer duration-150`}>{closeSectionPinned ? <ArrowDropDownRoundedIcon fontSize="large" /> : <ArrowDropDownIcon fontSize="large" />}</p>
                          <h2 className="uppercase text-center text-[10px] sm:text-xs font-medium tracking-wide">pinned notes</h2>
                        </button>
                      </Tooltip>
                    
                      <div className={`${(closeSectionPinned && !searchInput) ? "hidden" : "block"} p-1 sm:p-4 w-full gap-2 md:gap-4 columns-2 md:columns-3 lg:columns-4 space-y-2 md:space-y-4 mx-auto ${isDark ? "bg-dark-surface" : "bg-white/50"} rounded-2xl`}>
                      {
                        allPinnedNotes?.map((note) => (
                              <React.Fragment key={note.id}>
                                <Note 
                                  title={note.title}
                                  noteId={note.id}
                                  note_value={note.data_value}
                                  note_date={note.created_at}
                                  updated_at={note.updated_at}
                                  note_privacy={note.privacy}
                                  bgColor={note.bg_color}
                                  updateId={note.id}
                                  noteObj={note}
                                  activeNote={setactiveNote}
                                  isRefetching={pinnedNotesQuery.isRefetching}
                                  handleDrop={() => onDrop(allPinnedNotes.indexOf(note), allPinnedNotes, true)}
                                />
                              </React.Fragment>
                            )
                          )
                      }
                        {/* Load sentinel for pinned notes */}
                        <LoadSentinel 
                          onLoadMore={() => pinnedNotesQuery.fetchNextPage()}
                          hasNextPage={pinnedNotesQuery.hasNextPage}
                          isFetchingNextPage={pinnedNotesQuery.isFetchingNextPage}
                        />
                      </div>
                    </>
                  }

                </div>

                <div className="w-full flex flex-col gap-5">
                  
                  {
                      (combinedNotes.some((note) => note.pinned) && combinedNotes.some((note) => !note.pinned)) &&
                      <Tooltip title={closeSection ? "Open Notes" : "Close notes"} arrow placement='top'>
                        <button className={`w-fit flex justify-center items-center ${!closeSection ? (isDark ? 'bg-dark-border text-dark-text' : 'bg-[#f4f7f8] text-[#255f6f]') : (isDark ? 'bg-dark-surface text-dark-text border border-dark-border' : 'bg-white')} border-[1px] ${isDark ? 'border-dark-border' : 'border-gray-500/20'} pr-4 rounded-full z-40`} onClick={() => {
                          userToggledUnpinnedRef.current = true
                          setCloseSection(!closeSection)
                        }}>
                          <p className={`${!closeSection && "-rotate-180"} cursor-pointer duration-150`}>{closeSection ? <ArrowDropDownRoundedIcon fontSize="large" /> : <ArrowDropDownIcon fontSize="large" />}</p>
                          <h2 className="uppercase text-center text-[10px] sm:text-xs font-medium tracking-wide">other notes</h2>
                        </button>
                      </Tooltip>
                  }
                  
                  { combinedNotes.some((note) => !note.pinned) &&
                    <div className={`${(closeSection && !searchInput) ? "hidden" : "block"} p-1 sm:p-4 w-full gap-2 md:gap-4 columns-2 md:columns-3 lg:columns-4 space-y-2 md:space-y-4 mx-auto ${isDark ? "bg-dark-surface" : "bg-white/50"} rounded-2xl`}>
                      
                      {
                        allUnpinnedNotes?.map((note) => (
                            <React.Fragment key={note.id}>
                              <Note 
                                title={note.title}
                                noteId={note.id}
                                note_value={note.data_value}
                                note_date={note.created_at}
                                updated_at={note.updated_at}
                                note_privacy={note.privacy}
                                bgColor={note.bg_color}
                                updateId={note.id}
                                noteObj={note}
                                activeNote={setactiveNote}
                                isRefetching={unpinnedNotesQuery.isRefetching}
                                handleDrop={() => onDrop(allUnpinnedNotes.indexOf(note), allUnpinnedNotes, false)}
                              />
                            </React.Fragment>
                          )
                        )
                      }
                      {/* Load sentinel for unpinned notes */}
                      <LoadSentinel 
                        onLoadMore={() => unpinnedNotesQuery.fetchNextPage()}
                        hasNextPage={unpinnedNotesQuery.hasNextPage}
                        isFetchingNextPage={unpinnedNotesQuery.isFetchingNextPage}
                      />
                    </div>
                  }

                </div>
              </div> : 
              <div className="py-20 w-full flex justify-center items-center">
                { isLoading ? 
                  <div className="h-[1px] w-32 bg-slate-200 relative overflow-hidden">
                    <p className="text-lg font-light">Loading notes</p>
                    <motion.div 
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute top-0 h-full w-1/2 bg-[#255f6f] dark:bg-[#3b8a9e]"
                    />
                  </div>
                   : message
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
              className={`fixed w-full h-full top-0 left-0 ${!expand ? "sm:p-5 md:py-10" : "p-0"} flex justify-center items-center z-[70] duration-150 transition-all`}
              >
                {/* backdrop */}
                <div className="fixed w-full h-full bg-black/80" onClick={handleNav}></div>

                <div className={`${expand ? "w-full h-full" : "w-full h-full lg:w-[90%] xl:w-[60%]"} group duration-150 transition-all`}>
                  <form
                    onSubmit={handleNoteAdd}
                    className={`opacity-100 relative flex flex-col w-full h-full ${!expand && "sm:rounded-[2rem]"} ${colorOptionValue ? colorOptionValue : "bg-white"} border shadow-md duration-150 transition-all z-50 overflow-hidden`}
                  >
                    {/* Header Actions */}
                    <div className="flex gap-2 items-center z-20 justify-end p-4">
                      {/* Expand note  */}
                      <Tooltip title={ !expand ? "Go FullScreen" : "Revert to default" } placement="bottom" arrow className='hidden sm:flex'>
                        <button className={`w-8 h-8 flex justify-center items-center border-[1px] cursor-pointer p-1 rounded-full ${expand ? `${verifyColorIsWhite() ? "text-[#114f60] bg-[#114f60]/10" : colorOptionValue}` : "lg:hover:bg-[#114f60]/10"} rounded-full cursor-pointer transition-all duration-150`} type="button"
                          onClick={() => setExpand(!expand)}
                        >
                            {expand ? <FullscreenExitRoundedIcon color="inherit"/> : <FullscreenRoundedIcon color="inherit"/>}
                        </button>
                      </Tooltip>
                      {/* <button
                        className={`w-8 h-8 z-20 border-[1px] border-${getColor(colorOptionValue)} hover:bg-black/10 rounded-full transition-all duration-150`}
                        type="button"
                        onClick={handleNav}
                      >
                        <ClearRoundedIcon />
                    </button> */}
                    
                    <Tooltip title="Close Editing" placement="bottom" arrow>
                      <button className="w-8 h-8 border-[1px] hover:bg-black/10 rounded-full transition-all duration-150" type="button"
                        onClick={() => handleNav()}
                        disabled={isPending}
                      >
                        <ClearRoundedIcon />
                      </button>
                    </Tooltip>
                    </div>

                    {/* input fields Section */}
                    <div className={`relative w-full h-full flex flex-col ${colorOptionValue}`}>
              
                      <div className='flex items-center justify-end px-4 bg-transparent md:px-8 py-4 pb-2 float-right'>
                      {/* Title Field */}
                        <input
                          type="text"
                          name="title"
                          value={noteTitle} // Ensure this state exists
                          onChange={handleTitleChange} // Ensure this handler exists
                          placeholder="Title"
                          maxLength="100"
                          className={`w-full outline-none font-bold text-xl md:text-2xl placeholder:text-${getColor(colorOptionValue)}/50 [unicode-bidi:plaintext] text-start bg-inherit ltr transition-all duration-150`}
                          dir="auto"
                        />
                        {noteTitle.length > 0 && <Tooltip title={`${titleWordsCount} of ${MAX_TITLE_WORDS} words used`} arrow placement="top">
                          <div className="cursor-help">
                            <TitleWordProgress />
                          </div>
                        </Tooltip>}
                      </div>

                      {/* Note Body Field */}
                      <textarea
                        ref={inputRef}
                        autoFocus
                        value={noteInput}
                        onChange={handleChange}
                        className={`w-full flex-grow outline-none resize-none placeholder:text-${getColor(colorOptionValue)}/50 px-4 md:px-8 py-4 pb-5 text-base [unicode-bidi:plaintext] text-start ltr z-30 transition-all duration-150 bg-transparent`}
                        placeholder="Write Note"
                        dir="auto"
                      />
                    </div>

                    {/* Footer Actions */}
                    <div className="relative w-full flex flex-col lg:flex-row justify-center items-center gap-4 py-4 md:py-8">
                      {isPending ? (
                        <div className="w-full flex justify-center items-center px-3 md:px-5 pt-4 transition-all duration-150">
                          <span className="loading loading-spinner loading-sm"></span>
                        </div>
                      ) : (
                        <div className={`relative w-full flex justify-center gap-4 items-center px-3 md:px-5 ${wordCount > 0 ? "gap-4" : "gap-0"} transition-all duration-150`}>
                          {/* color palette */}
                          <ColorPallete
                            show={showColorPallete}
                            colorOption={colorOptionValue}
                            addBackground={handleColorOption}
                          />
                          <Tooltip title="Choose color" arrow>
                            <i className={`flex justify-center items-center ${wordCount > 0 ? "w-10 h-10 rounded-full" : "scale-0 w-0 h-0 opacity-0"} ${showColorPallete? "bg-warning shadow-lg border-none": "border-[1px] border-black"} hover:bg-warning hover:border-none z-30 transition-all duration-200 cursor-pointer`}
                              onClick={() => setShowColorPallete(!showColorPallete)}
                            >
                              <ColorLensRoundedIcon sx={{ fontSize: 18 }} />
                            </i>
                          </Tooltip>

                          {/* Clear all text */}
                          <Tooltip title={ wordStore !== "" && wordCount < 1 ? "Revert Note" : "Clear Note" } placement="top" arrow>
                            <button
                              className={
                                wordCount > 0 && wordStore == ""
                                  ? "w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-black shadow-lg hover:text-white hover:bg-slate-400 hover:border-none transition-all duration-150" :
                                  wordStore !== "" && wordCount < 1 ? "w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-slate-400 shadow-lg hover:text-white hover:bg-slate-400 hover:border-none transition-all duration-150"
                                  : "scale-0 w-0 h-0 opacity-0 transition-all duration-200"
                              }
                              type="button"
                              onClick={wordStore !== "" && wordCount < 1 ? revertInput : clearInput}
                            >
                              {wordStore !== "" && wordCount < 1 ? <HistoryRoundedIcon /> : <ClearAllRoundedIcon />}
                            </button>
                          </Tooltip>

                          {/* add note */}
                          <Tooltip title="Add Note" arrow>
                            <button
                              type="submit"
                              className={wordCount > 0 ? "h-10 flex justify-center items-center rounded-full px-5 border-[1px] border-[#114f60] dark:border-[#3b8a9e] shadow-lg text-[#114f60] dark:text-[#3b8a9e] hover:text-white hover:bg-[#114f60] dark:hover:bg-[#2d7a8a] dark:hover:text-white hover:border-none transition-all duration-150" : "scale-0 w-0 h-0 opacity-0 transition-all duration-200"}
                            >
                              <CheckRoundedIcon />
                            </button>
                          </Tooltip>

                          {/* Word count desktop */}
                          <Tooltip title={`${wordCount} of ${MAX_NOTE_CHARACTERS} characters used`} arrow placement="top">
                            <span className="hidden lg:block lg:absolute left-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                              <span className={`${wordCount < 20000 ? "text-[#22c55e]" : wordCount < 700 ? "text-[#eab308]" : "text-[#ef4444]"}`}>{wordCount}</span>/
                              {MAX_NOTE_CHARACTERS} characters
                            </span>
                          </Tooltip>
                        </div>
                      )}

                      {/* word count mobile */}
                      <div className="w-full flex lg:hidden items-center justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                          <span className={`${wordCount < 20000 ? "text-[#22c55e]" : wordCount < MAX_NOTE_CHARACTERS ? "text-[#eab308]" : "text-[#ef4444]" }`}>{wordCount}</span>{MAX_NOTE_CHARACTERS} characters
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Direct Note Modal - for notes accessed via URL that aren't in the DOM */}
          <AnimatePresence>
            {isDirectNoteOpen && directNoteData && (
              <NoteModal
                setGetNoteTitle={setDirectNoteTitle}
                setGetNote={setDirectNoteContent}
                setWordCount={setDirectWordCount}
                getNoteTitle={directNoteTitle}
                getNote={directNoteContent}
                colorOptionValue={directColorOption}
                notePrivacy={directNotePrivacy}
                setColorOptionValue={setDirectColorOption}
                setShowColorPallete={setDirectShowColorPallete}
                showColorPallete={directShowColorPallete}
                wordCount={directWordCount}
                setNotePrivacy={setDirectNotePrivacy}
                debouncedNoteInput={directDebouncedNote}
                debouncedTitleInput={directDebouncedTitle}
                wordStore={directWordStore} 
                setWordStore={setDirectWordStore}
                showDeleteModal={false}
                setShowDeleteModal={() => {}}
                setToggleAction={() => {}}

                note_date={directNoteData.created_at}
                updated_at={directNoteData.updated_at}
                noteIsPinned={directNoteData.pinned}
                updatingPin={directNotePinMutation.isPending}
                stateLoading={stateLoading}
                updating={directNoteUpdateMutation.isPending}
                isEditing={isDirectNoteOpen}

                updateNote={handleDirectNoteUpdate}
                handlePinUpdate={handleDirectNotePin}
                handleNav={handleDirectNoteClose}
              />
            )}
          </AnimatePresence>

          {/* Add Noet Button */}
            <Tooltip title="Add Noet" arrow placement="top"  className={`${markedNotes.length > 0 ? "opacity-0" : "opacity-100"} fixed bottom-4 md:bottom-10 right-10 lg:right-12 2xl:right-[20vw] duration-150 transition-all z-30`}>
                <button type="submit" className="cursor-pointer flex justify-center items-center rounded-full shadow-lg text-white text-sm font-bold bg-[#255f6f] hover:bg-[#114f60] dark:bg-[#3b8a9e] dark:hover:bg-[#2d7a8a] px-4 py-4 transition-all duration-150 z-30" onClick={handleNav} disabled={markedNotes.length > 0}> 
                  <AddRoundedIcon sx={{ fontSize: 20 }}/> 
                  Add Note
                </button>
            </Tooltip>

      </div>
    ) 
  }
  

}

export default Home