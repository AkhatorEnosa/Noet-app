import { useState } from "react"
import useDeleteNote from "../hooks/useDeleteNote"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import useUpdateNote from "../hooks/useUpdateNote";

/* eslint-disable react/prop-types */
const Todo = ({note, noteId}) => {

  const [getNote, setGetNote] = useState(note)
  const [wordCount, setWordCount] = useState(note.length)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const {mutate, isPending, isSuccess} = useDeleteNote()
  const {mutate:update, isPending:updating} = useUpdateNote()


  const handleChange = (e) => {
    setGetNote(e.target.value)
    setWordCount(e.target.value.length)
  }

  const handleTodoUpdate = (e) => {
    e.preventDefault()
    if(getNote.trim() !== "") {
      update({data_value: getNote.trim().toString(), id: noteId})
    } else {
      setGetNote('')
      setWordCount(0)
    }
      setShowEditModal(!showEditModal)
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
    <div className="break-inside-avoid w-full px-4 py-6 border-[1px] border-black/10 bg-white shadow-md rounded-md text-xl cursor-pointer hover:shadow-lg transition-shadow duration-200 z-10">
        <p className={note.length > 350 ? "w-full text-sm pb-4 break-all" : "w-full pb-8 break-all"}
         onClick={() => setShowEditModal(!showEditModal)}>{truncateTodo(note)}</p>
        <div className="w-full flex justify-end items-center "><DeleteRoundedIcon onClick={() => setShowDeleteModal(!showDeleteModal)} className="absolute text-sm text-neutral/70 hover:text-neutral z-30 cursor-default"/></div>

        {showEditModal && <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/50 z-50">
              <div className="w-[80%] lg:w-[60%] h-auto">
                <form onSubmit={handleTodoUpdate} className="relative gap-4 w-full h-full pb-2 border justify-center items-center rounded-lg shadow-md bg-white">
                  <div className="flex items-center justify-end top-2 right-2 px-2 pt-2">
                    <button className={wordCount > 0 ? "z-20 text-black/70 hover:text-neutral transition-all duration-300": "hidden transition-all duration-300"} type="button" onClick={clearInput}><ClearRoundedIcon /></button>
                  </div>
                    <textarea type="text" value={getNote} onChange={handleChange} className={wordCount == 0 ? "w-full outline-none resize-none p-4 text-base z-30 transition-all duration-300" : ((wordCount > 100) && (wordCount < 500)) ? "w-full outline-none resize-none bg-primary-content/20 py-4 h-32 px-4 text-base z-30 transition-all duration-300" : wordCount >= 500 ? "w-full outline-none resize-none bg-primary-content/20 py-4 px-4 text-lg h-[40rem] z-30 transition-all duration-300" : "w-full outline-none resize-none bg-primary-content/20 py-4 p-4 z-30 transition-all duration-300"} placeholder="Write Note"/>

                    <div className="w-full flex justify-center items-center py-2">
                        <button type="submit" disabled={updating} className={wordCount > 0 ?"cursor-pointer bg-primary text-white rounded-full w-10 h-10 flex justify-center items-center hover:shadow-lg hover:border-2 transition-all duration-200" : "cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"}><AddRoundedIcon/></button>
                    </div>

                    {/* <div className="w-full flex justify-center items-center gap-5 mt-5 text-sm">
                      {isPending || isSuccess ? <span className="loading loading-spinner loading-sm"></span> : <><button className="flex justify-center items-center p-3 hover:bg-[#ff2222] bg-error rounded-md" onClick={() => mutate(noteId) && setShowEditModal(!showEditModal)}><DeleteRoundedIcon />Accept</button>
                      <button className="flex justify-center items-center p-3 bg-neutral hover:bg-black text-white rounded-md" onClick={() => setShowEditModal(!showEditModal)}><ClearRoundedIcon/>Cancel</button></>}
                    </div>  */}
                </form>
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