import Logo from '../assets/logo.webp';
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion';
import useLogin from '../hooks/useLogin';
import { useSelector } from 'react-redux';

const SignIn = () => {
  const { mutate, isPending, isLoading:loading } = useLogin();
  const { isLoading } = useSelector((state) => state.app);

  const handleSignIn = () => mutate();

  if (isPending || loading || isLoading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fcfcfc] overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <img src={Logo} alt="logo" className="w-24 grayscale opacity-80 mb-6" />
            <div className="h-[1px] w-32 bg-slate-200 dark:bg-dark-border relative overflow-hidden">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 h-full w-1/2 bg-[#255f6f] dark:bg-[#3b8a9e]"
              />
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden text-slate-900">
    

      <div className="relative z-10 w-full max-w-xl px-8 flex flex-col items-center">
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
          <img src={Logo} alt="logo" className="w-16 mb-12" />
        </motion.div>

        <div className="text-center">
          {/* THE RETAINED HERO SECTION */}
          <h1 className="text-6xl lg:text-7xl font-serif text-slate-900 dark:text-dark-text tracking-tight mb-8">
            Think <span className="italic font-light text-[#255f6f] dark:text-[#3b8a9e]">deeply.</span>
          </h1>
          
          <p className="text-slate-500 dark:text-dark-textMuted font-light text-xl mb-14 max-w-md mx-auto leading-relaxed border-l border-slate-200 dark:border-dark-border pl-6">
            A sanctuary for your digital thoughts. Distraction-free by design.
          </p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[300px]">
          <button 
            onClick={handleSignIn}
            className="group relative w-full flex items-center justify-center gap-3 py-4 bg-[#1A1A1A] dark:bg-dark-surface text-white rounded-full overflow-hidden transition-all duration-150 hover:bg-[#255f6f] dark:hover:bg-[#3b8a9e] hover:shadow-[0_10px_30px_rgba(37,95,111,0.3)]"
            disabled={isPending || isLoading || loading}
          >
            {isPending || isLoading || loading ? 
              <span className='loading loading-spinner loading-sm'></span> :
              <>
                <GoogleIcon sx={{ fontSize: 18, color: '#fff' }} className="z-10" />
                <span className="font-medium tracking-tight z-10">Get Started</span>
              </>
            }
          </button>

          <p className="mt-10 text-center text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
            Secure Cloud Auth
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;