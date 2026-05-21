/* eslint-disable react/prop-types */

import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

function ConfirmModal({ action, setAction, pending, handleConfirm, title, desc }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
        action && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`w-full max-w-sm rounded-2xl p-6 shadow-xl ${isDark ? 'bg-dark-surface' : 'bg-white'}`}
                >
                      <h2 className={`text-xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{title}</h2>
                    <p className={`mt-2 text-sm ${isDark ? 'text-dark-textMuted' : 'text-gray-500'}`}>
                        {desc}
                    </p>

                    <div className="mt-6 flex gap-3">
                        <button 
                            disabled={pending}
                            onClick={() => setAction(false)}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${isDark ? 'text-dark-text bg-dark-border hover:bg-dark-border/80' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={pending}
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors flex justify-center items-center gap-2"
                        >
                            {pending ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Delete"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )
  )
}

export default ConfirmModal