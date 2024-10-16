import { useRef, useState } from "react"
import useCreateTodo from "../hooks/useCreateNote"
import useTodos from "../hooks/useNotes"
import Todo from "../components/Todo"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

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


        <form onSubmit={handleTodoAdd} className="relative gap-4 w-full md:w-96 lg:w-[500px] h-full p border justify-center items-center rounded-t-lg shadow-md">
            <button className="absolute w-full text-right p-4 z-40"><ClearRoundedIcon /></button>
            <textarea type="text" ref={inputRef} onChange={()=> inputRef.current && setWordCount(inputRef.current.value.length)} className={wordCount > 100 ? "w-full outline-none resize-none h-64 p-4 bg-primary-content/10 text-base z-30 transition-all duration-300" : "w-full outline-none resize-none p-4 text-lg h-auto z-30 transition-all duration-300"} placeholder="Write Note"/>
            <div className="w-full flex justify-center items-center py-2">
                <button type="submit" disabled={fetchStatus === 'fetching'} className={wordCount > 0 ?"cursor-pointer bg-primary text-white rounded-full w-10 h-10 flex justify-center items-center hover:shadow-lg hover:border-2 transition-all duration-300" : "cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 flex justify-center items-center transition-all duration-300"}><AddRoundedIcon/></button>
            </div>
        </form>

        <div className="w-full flex flex-col justify-center items-center p-10">
            {isLoading && <p>Loading...</p>}

            {!isLoading && <div className="w-full gap-4 flex flex-col items-center justify-center">
              <div className={fetchStatus === 'fetching' ? "flex" : "opacity-0"}><span className="loading loading-spinner loading-sm"></span></div>
                <div className="w-full gap-4 columns-1 sm:columns-2 lg:columns-3 mx-auto space-y-4">
                  {todos?.map((todo) => (
                      <Todo key={todo.id} 
                      noteId={todo.id}
                      note={todo.data_value}/>
                  ))}
                </div>
            </div>}
        </div>
    </div>
  )
}

export default Home