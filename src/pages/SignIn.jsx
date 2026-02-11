import Logo from '../assets/logo.webp';
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion';
import useLogin from '../hooks/useLogin';
import { useSelector } from 'react-redux';

// Random background note snippets
const snippets = [
  { id: 1, text: "Idea: A minimalist note app", top: "15%", left: "10%", delay: 0 },
  { id: 2, text: "Meeting at 4pm with the team", top: "25%", left: "75%", delay: 1 },
  { id: 3, text: "Grocery: Oat milk, Kale, Apples", top: "70%", left: "15%", delay: 2 },
  { id: 4, text: "Project Alpha - Phase 1", top: "65%", left: "80%", delay: 0.5 },
  { id: 5, text: "Don't forget the dream journal", top: "10%", left: "60%", delay: 1.5 },
  { id: 6, text: "Ref: https://design-notes.io", top: "85%", left: "55%", delay: 2.5 },
];

const SignIn = () => {
  const { mutate, isPending } = useLogin();
  const { isLoading } = useSelector((state) => state.app);

  const handleSignIn = () => mutate();

  if (isPending || isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white overflow-hidden">
      <motion.div 
        animate={{ scale: [0.95, 1, 0.95], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="flex flex-col items-center gap-4"
      >
        <img src={Logo} alt="logo" className="w-[200px]" />
        <p className="text-[10px] font-bold tracking-[0.5em] text-slate-400">INDEXING THOUGHTS</p>
      </motion.div>
    </div>
  );

  return (
    <div className="h-screen w-full relative bg-[#fcfcfc] flex items-center justify-center overflow-hidden selection:bg-[#114f60]/20">
      
      {/* Paper Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4]" 
        style={{ 
          backgroundImage: `radial-gradient(#e2e8f0 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Floating note snippets */}
      <div className="absolute inset-0 pointer-events-none">
        {snippets.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0.1, 0.25, 0.1], 
              y: [0, -15, 0],
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

      {/* 3. main login interface */}
      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <img src={Logo} alt="logo" className="w-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl lg:text-6xl font-serif text-slate-900 tracking-tight mb-6">
            Think <span className="italic text-[#114f60]/80">clearly.</span>
          </h1>
          <p className="text-slate-500 font-light text-lg mb-12 max-w-sm mx-auto leading-relaxed">
            The minimal, distraction-free home for your ideas and daily notes.
          </p>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-[320px]"
        >
          <button 
            onClick={handleSignIn}
            className="group w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-full hover:border-slate-900 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
          >
            <GoogleIcon sx={{ fontSize: 20, color: '#1a1a1a' }} />
            <span className="font-semibold text-slate-900 tracking-tight">Enter your workspace</span>
          </button>

          <p className="mt-8 text-center text-[11px] text-slate-400 font-medium tracking-wide">
            SECURE ACCESS BY GOOGLE CLOUD
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default SignIn;