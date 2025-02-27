import Navbar from "./components/Navbar"
import Home from "./pages/Home"

function App() {

  return (
    <div className="w-screen flex flex-col justify-between items-center relative" translate="yes">
        <div className="fixed w-screen h-screen bg-[url(./assets/bg-img.webp)] z-0"></div>
        <div className="fixed w-screen h-screen bg-white/90"></div>
        <Navbar />
        <Home />
    </div>
  )
}

export default App
