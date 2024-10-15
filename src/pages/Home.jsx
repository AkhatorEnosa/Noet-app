import { useRef, useState } from "react"
import useCreateTodo from "../hooks/useCreateNote"
import useTodos from "../hooks/useNotes"
import Todo from "../components/Todo"
import { FaPlus } from "react-icons/fa6"

const Home = () => {
  let inputRef = useRef('')

  const {data:todos, error, isLoading, fetchStatus} = useTodos()
  const {mutate} = useCreateTodo()

  const [wordCount, setWordCount] = useState(0)

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


        <form onSubmit={handleTodoAdd} className="gap-4 w-full md:w-96 lg:w-[500px] h-full p-4 border justify-center items-center rounded-t-lg shadow-md">
            <textarea rows={2} type="text" ref={inputRef} onChange={()=> inputRef.current && setWordCount(inputRef.current.value.length)} className="w-full outline-none resize-none" placeholder="Write Note"/>
            <div className="w-full flex justify-end items-center">
                {wordCount > 0 && <button type="submit" disabled={fetchStatus === 'fetching'} className="cursor-pointer bg-neutral/50 hover:bg-primary text-white rounded-full w-10 h-10 flex justify-center items-center"><FaPlus/></button>}
            </div>
        </form>

        {fetchStatus === 'fetching' && <span>Refreshing...</span>}
        <div className="w-full p-10">
            {!isLoading ? <div className="w-full gap-4 columns-1 sm:columns-2 lg:columns-3 mx-auto space-y-4">

            {todos?.map((todo) => (
                <Todo key={todo.id} 
                noteId={todo.id}
                note={todo.data_value}/>
            ))}
            </div>
            : <p>Loading</p>}
        </div>
    </div>
  )
}

export default Home