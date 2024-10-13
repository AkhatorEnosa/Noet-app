import { useRef } from "react"
import useTodos from "./hooks/useTodos"
import useCreateTodo from "./hooks/useCreateTodo"

function App() {
  let inputRef = useRef('')

  const {data, error, fetchStatus} = useTodos()
  const {mutate} = useCreateTodo()

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
    <div>
      <h1>Todo List App</h1>

      <form onSubmit={handleTodoAdd}>
        <input type="text" ref={inputRef} onChange={()=> inputRef.current}/>
        <button type="submit">Add todo</button>
      </form>

        <ul>
          {fetchStatus === 'fetching' && <span>Loading...</span>}
          {data?.map((todo) => (
            <li key={todo.id}>{todo.data_value}</li>
          ))}
        </ul>
    </div>
  )
}

export default App
