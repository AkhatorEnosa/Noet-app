import { useRef, useState } from "react"
import useCreateTodo from "../hooks/useCreateNote"
import useNotes from "../hooks/useNotes"
import Todo from "../components/Todo"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useSelector } from "react-redux";

const Home = () => {
  const todos = useSelector((state) => state.data.todos)
  let inputRef = useRef('')

  const {error, isLoading, fetchStatus} = useNotes()
  const {mutate} = useCreateTodo()

  const [wordCount, setWordCount] = useState(0)

  const handleTodoAdd = (e) => {
    e.preventDefault()
    // findLink(inputRef.current.value)
    if(inputRef.current.value.trim() !== "") {
      mutate({data_value: inputRef.current.value.toString()})
    } else {
      inputRef.current.focus();
      setWordCount(0)
    }
      inputRef.current.value = ''
      setWordCount(0)
  }

  const clearInput = () => {
    setWordCount(0)
    inputRef.current.value = ''
  }

  if(error) return  <h3>Error: {error}</h3>
  return (
    <div className="w-full flex flex-col gap-5 px-3 md:px-10 lg:px-20 py-10 justify-center items-center">


        <form onSubmit={handleTodoAdd} className="relative gap-4 w-full md:w-96 lg:w-[500px] h-full p border justify-center items-center rounded-t-lg shadow-md">
          <div className="flex items-center justify-end top-2 right-2 px-2 pt-2">
            <button className={wordCount > 0 ? "z-20 text-black/70 hover:text-neutral transition-all duration-300": "hidden transition-all duration-300"} type="button" onClick={clearInput}><ClearRoundedIcon /></button>
          </div>
            <textarea type="text" ref={inputRef} onInput={()=> inputRef.current && setWordCount(inputRef.current.value.length)} className={wordCount < 1 ? "w-full outline-none resize-none p-4 text-base z-30 transition-all duration-300" : wordCount > 100 ? "w-full outline-none resize-none h-64 px-4 text-base z-30 transition-all duration-300" : "w-full outline-none resize-none px-4 text-lg h-auto z-30 transition-all duration-300"} placeholder="Write Note"/>
            <div className="w-full flex justify-center items-center py-2">
                <button type="submit" disabled={fetchStatus === 'fetching'} className={wordCount > 0 ?"cursor-pointer bg-primary text-white rounded-full w-10 h-10 flex justify-center items-center hover:shadow-lg hover:border-2 transition-all duration-200" : "hidden cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 justify-center items-center transition-all duration-200"}><AddRoundedIcon/></button>
            </div>
        </form>

        <div className="w-full flex flex-col justify-center items-center">

            {!isLoading && <div className="w-full gap-4 flex flex-col items-center justify-center">
                <div className="w-full gap-4 columns-2 md:columns-3 lg:columns-4 mx-auto space-y-4">
                  {todos?.data.map((todo) => (
                      <Todo key={todo.id} 
                      noteId={todo.id}
                      note={todo.data_value}
                      updateId={todo.id}/>
                  ))}
                </div>
            </div>}
        </div>
    </div>
  )
}

export default Home