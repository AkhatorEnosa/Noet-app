/* eslint-disable react/prop-types */
const Todo = ({note, noteId, deleteNote}) => {
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
        <div className="w-full flex justify-end items-center text-sm"><span className="material-symbols-outlined text-neutral/50 hover:text-error duration-300 transition-colors" onClick={deleteNote(noteId)}>delete</span></div>
    </div>
  )
}

export default Todo