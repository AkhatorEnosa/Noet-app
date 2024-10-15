import { useRef, useState } from "react"
import useCreateTodo from "../hooks/useCreateTodo"
import useTodos from "../hooks/useTodos"
import Todo from "../components/Todo"

const Home = () => {
  let inputRef = useRef('')

  const {data:todos, error, isLoading, fetchStatus} = useTodos()
  const {mutate} = useCreateTodo()

  const [wordCount, setWordCount] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleTodoAdd = (e) => {
    e.preventDefault()
    if(inputRef.current.value.length > 0) {
      mutate({data_value: inputRef.current.value})
    } else {
      inputRef.current.focus();
    }
      inputRef.current.value = ''
  }

  if(error) return  <h3>Error: {error}</h3>
  return (
    <div className="w-full flex flex-col gap-5 px-20 py-10 justify-center items-center">


        <label className="w-full md:w-96 lg:w-[500px] h-full input input-bordered-b border-b border-primary items-center p-2">
            <form onSubmit={handleTodoAdd} className="gap-4 w-full justify-center items-center">
                <textarea rows={5} type="text" ref={inputRef} onChange={()=> inputRef.current && setWordCount(inputRef.current.value.length)} className="w-full outline-none resize-none" placeholder="Write Note"/>
                <div className="w-full flex justify-end items-center">
                    {wordCount > 0 && <button type="submit" disabled={fetchStatus === 'fetching'} className="cursor-pointer bg-neutral/50 hover:bg-primary text-white rounded-full w-10 h-10 flex justify-center items-center"><span className="material-symbols-outlined">add</span></button>}
                </div>
            </form>
        </label>

        {fetchStatus === 'fetching' && <span>Refreshing...</span>}
        <div className="w-full p-10">
            {!isLoading ? <div className="w-full gap-4 columns-1 sm:columns-2 lg:columns-3 mx-auto space-y-4">

            {todos?.map((todo) => (
                <Todo key={todo.id} 
                noteId={todo.id}
                note={todo.data_value}
                deleteNote={() => setShowDeleteModal(!showDeleteModal)}/>
            ))}
            </div>
            : <p>Loading</p>}
        </div>

        {/* <div className={showDeleteModal ? "absolute w-full h-full top-0 left-0 bg-black/50 backdrop-blur-md" : "hidden"}>
            <div className="w-96 bg-white rounded-md">
                <h1>Delete?</h1>
                <button className="p-3 bg-error">Accept</button>
                <button className="p-3 bg-neutral text-white" onClick={() => setShowDeleteModal(!showDeleteModal)}>Cancel</button>
            </div>
        </div> */}
    </div>
  )
}

export default Home