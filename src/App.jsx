import Navbar from "./components/Navbar"
import Home from "./pages/Home"

function App() {
  return (
    <div className="w-screen flex flex-col justify-between items-center relative bg-[url(./assets/bg-img.webp)] bg-opacity-5" translate="yes">
        <Navbar />
        <Home />
    </div>
  )
}

export default App
