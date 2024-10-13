import useTodos from "./hooks/useTodos"

function App() {
  const {data, error, isLoading} = useTodos()
   if(isLoading) return <h3>Loading...</h3>
  if(error) return  <h3>Error: {error}</h3>
  return (
    <div>
      <h1>Todo List App</h1>

        <ul>
          {data.map((todo) => (
            <li key={todo.id}>{todo.data_value}</li>
          ))}
        </ul>
    </div>
  )
}

export default App
