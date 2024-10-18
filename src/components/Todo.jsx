import { useRef, useState } from "react"
import useDeleteNote from "../hooks/useDeleteNote"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import useUpdateNote from "../hooks/useUpdateNote";

/* eslint-disable react/prop-types */
const Todo = ({note, noteId}) => {

  let noteRef = useRef()

  const [getNote, setGetNote] = useState(note)
  const [wordCount, setWordCount] = useState(note.length)
  const [todoHeight, setTodoHeight] = useState(0)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const {mutate, isPending, isSuccess} = useDeleteNote()
  const {mutate:update, isPending:updating, isSuccess:updated} = useUpdateNote()

  const handleChange = (e) => {
    setGetNote(e.target.value)
    setWordCount(e.target.value.length)
  }

  const handleTodoUpdate = (e) => {
    e.preventDefault()
    if(getNote.trim() !== "") {
      update({data_value: getNote.trim().toString(), id: noteId})
        setTimeout(() => {
          setShowEditModal(!showEditModal)
        }, 500);
    } else {
      setGetNote('')
      setWordCount(0)
    }
  }

  const clearInput = () => {
    setGetNote(note)
    setWordCount(note.length)
      setShowEditModal(!showEditModal)
  }


  const truncateTodo = (x) => {
      if(x.length > 600) {
          return x.substring(0, 599).concat('...')
      } else  {
          return x
      }
  }
  return (
    <div>
        <div ref={noteRef} className={showEditModal ? "opacity-0 break-inside-avoid w-full pb-6 border-[1px] border-black/10 shadow-md text-lg hover:shadow-lg transition-shadow duration-200  break-words" : "break-inside-avoid w-full pb-6 group border-[1px] border-black/10 bg-white shadow-md rounded-md text-lg cursor-pointer hover:shadow-lg transition-shadow duration-200  break-words z-10"}>
          <p className={note.length > 350 ? "w-full text-sm leading-normal px-3 pt-3 pb-4" : "w-full leading-normal px-3 pt-2 pb-4"}
          onClick={() => (setTodoHeight(noteRef.current.offsetHeight) & setShowEditModal(!showEditModal))}>{truncateTodo(note)}</p>
          <div className="w-full px-4 justify-end items-center hidden group-hover:flex transition-all duration-300"><DeleteRoundedIcon onClick={() => setShowDeleteModal(!showDeleteModal)} className="absolute hidden text-neutral/70 hover:text-neutral z-30 cursor-default" sx={{ fontSize: 18 }}/></div>
        </div>

        {showEditModal && <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/50 z-50">
              <div className="w-[80%] lg:w-[60%] h-auto">
              {updated ? <span className="loading loading-spinner loading-sm"></span> :
                <form onSubmit={handleTodoUpdate} className="relative gap-4 w-full h-full pb-2 border justify-center items-center rounded-lg shadow-md bg-white">
                  <div className="flex items-center justify-end top-2 right-2 px-2 pt-2">
                    <button className={"z-20 text-black/70 hover:text-neutral transition-all duration-300"} type="button" onClick={clearInput}><ClearRoundedIcon /></button>
                  </div>
                    <textarea type="text" value={getNote} onChange={handleChange} className={wordCount == 0 ? "w-full outline-none resize-none p-4 text-base z-30 transition-all duration-300" : ((todoHeight < 300)) ? "w-full outline-none resize-none bg-primary-content/20 py-4 h-32 px-10 text-lg z-30 transition-all duration-300" : todoHeight >= 300 ? "w-full outline-none resize-none bg-primary-content/20 py-4 px-6 text-base h-[35rem] z-30 transition-all duration-300" : "w-full outline-none resize-none bg-primary-content/20 py-4 px-4 z-30 transition-all duration-300"} placeholder="Write Note"/>

                    <div className="w-full flex justify-center items-center py-2">
                       {updating ? <span className="loading loading-spinner loading-sm"></span> : <button type="submit" disabled={updating} className={wordCount > 0 ? "cursor-pointer bg-primary text-white rounded-full w-20 h-20 flex justify-center items-center shadow-md hover:shadow-lg hover:border-2 transition-all duration-200" : "cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"}> <AddRoundedIcon/></button>}
                    </div>
                </form>
              }
              </div>
        </div>}

        {showDeleteModal && <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/50 z-50">
            <div className="w-96 flex flex-col gap-3 px-4 py-4 bg-white rounded-md">
                <h1 className="text-lg font-semibold">Delete</h1>
                <hr />
                <p className="text-sm">Are you sure you want to Delete?</p>
                <div className="w-full flex justify-center items-center gap-5 mt-5 text-sm">
                  {isPending || isSuccess ? <span className="loading loading-spinner loading-sm"></span> : <><button className="flex justify-center items-center p-3 hover:bg-[#ff2222] bg-error rounded-md" onClick={() => mutate(noteId) && setShowDeleteModal(!showDeleteModal)}><DeleteRoundedIcon />Accept</button>
                  <button className="flex justify-center items-center p-3 bg-neutral hover:bg-black text-white rounded-md" onClick={() => setShowDeleteModal(!showDeleteModal)}><ClearRoundedIcon/>Cancel</button></>}
                </div> 
            </div>
        </div>}
    </div>
  )
}

export default Todo