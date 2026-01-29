import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./section/Navbar";

function App() {
  return (
    <Router>
      <div className="w-screen flex flex-col justify-between items-center relative" translate="yes">
        {/* Persistent Background Layers */}
        <div className="fixed inset-0 bg-[url(./assets/bg-img.webp)] bg-cover z-0"></div>
        <div className="fixed inset-0 bg-white/95 z-0"></div>

        {/* Persistent NavBar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="relative z-10 w-full flex flex-col items-center">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;