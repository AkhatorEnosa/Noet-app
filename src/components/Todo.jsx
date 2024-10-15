import { useState } from "react"
import { FaTrashCan } from "react-icons/fa6"
import useDeleteNote from "../hooks/useDeleteNote"

/* eslint-disable react/prop-types */
const Todo = ({note, noteId}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
    const {mutate} = useDeleteNote()

    const truncateTodo = (x) => {
        if(x.length > 600) {
            return x.substring(0, 599).concat('...')
        } else  {
            return x
        }
    }
  return (
    <div className="break-inside-avoid px-4 py-4 border-[1px] border-black/10 bg-white shadow-md rounded-md text-xl cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <p className={note.length > 350 ? "text-sm pb-4" : "pb-8"}>{truncateTodo(note)}</p>
        <div className="w-full flex justify-end items-center text-sm"><FaTrashCan onClick={() => setShowDeleteModal(!showDeleteModal)}/></div>


        {showDeleteModal && <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/50 backdrop-blur-md">
            <div className="w-96 flex flex-col gap-3 px-2 py-3 bg-white rounded-md">
                <h1 className="text-lg font-semibold">Delete?</h1>
                <hr />
                <p className="text-sm">Are you sure you want to Delete?</p>
                <div className="w-full flex justify-center items-center gap-5 mt-5 text-sm">
                  <button className="p-3 bg-error rounded-md" onClick={() => mutate(noteId)}>Accept</button>
                  <button className="p-3 bg-neutral text-white rounded-md" onClick={() => setShowDeleteModal(!showDeleteModal)}>Cancel</button>
                </div>
            </div>
        </div>}
    </div>
  )
}

export default Todo