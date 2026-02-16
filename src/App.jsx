import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion"; // Required for the snippets
import Home from "./pages/Home";
import Navbar from "./section/Navbar";
import MarkedNotesActionsBar from "./section/MarkedNotesActionsBar";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import { ToastContainer, Zoom } from "react-toastify";
import { green, indigo, red, yellow } from "@mui/material/colors";

// Random background note snippets
const snippets = [
  { id: 1, text: "Idea: A minimalist note app", top: "20%", left: "10%", delay: 0 },
  { id: 2, text: "Meeting at 4pm with the team", top: "25%", left: "75%", delay: 1 },
  { id: 3, text: "Grocery: Oat milk, Kale, Apples", top: "70%", left: "20%", delay: 2 },
  { id: 4, text: "Project Alpha - Phase 1", top: "65%", left: "80%", delay: 0.5 },
  { id: 5, text: "Don't forget the dream journal", top: "10%", left: "60%", delay: 1.5 },
];

function App() {
  return (
    <Router>
      <div className="w-screen flex flex-col justify-between items-center relative" translate="yes">
        {/* Persistent Background Layers */}
        <div className="fixed inset-0 bg-[url(./assets/bg-img.webp)] bg-cover opacity-50 z-0"></div>
        <div className="fixed inset-0 bg-white/95 z-0"></div>

        {/* Floating note snippets */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {snippets.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0.5, 0.25, 0.5], 
                y: [0, -20, 0],
                x: [0, 5, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                delay: note.delay,
                ease: "easeInOut" 
              }}
              className="absolute hidden lg:block bg-white border border-slate-200 px-4 py-3 rounded-md shadow-sm"
              style={{ top: note.top, left: note.left }}
            >
              <div className="w-8 h-1 bg-slate-100 rounded mb-2" />
              <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{note.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Persistent NavBar */}
        <Navbar />
        <MarkedNotesActionsBar />

        {/* Dynamic Page Content */}
        <main className="relative w-full flex flex-col items-center">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose="2000"
        pauseOnHover
        transition={Zoom}
        hideProgressBar
        draggable
        theme="dark"
        icon={({ type }) => {
          // theme is not used in this example but you could
          switch (type) {
            case 'info':
              return <InfoRoundedIcon sx={{ fontSize: 20, color: indigo[400]}}/>;
            case 'error':
              return <ErrorRoundedIcon sx={{ fontSize: 20, color: red[500]}}/>;
            case 'success':
              return <VerifiedRoundedIcon sx={{ fontSize: 20, color: green[500]}} />;
            case 'warning':
              return <ReportProblemRoundedIcon sx={{ fontSize: 20, color: yellow[500]}} />;
            default:
              return null;
          }
        }}
      />
    </Router>
  );
}

export default App;