import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Tooltip } from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import { motion, AnimatePresence } from "framer-motion";
import useDeleteNotes from "../hooks/useDeleteNotes";

const MarkedNotesActionsBar = () => {
    const { markedNotes, setMarkedNotes } = useContext(AppContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { mutate, isPending } = useDeleteNotes();

    const isVisible = markedNotes.length > 0;

    useEffect(() => {
        document.body.style.overflow = showDeleteModal ? 'hidden' : 'auto';
    }, [showDeleteModal]);

    const handleDeleteNotes = () => {
        mutate(markedNotes, {
            onSuccess: () => {
                setMarkedNotes([]);
                setShowDeleteModal(false);
            }
        });
    }

    return (
        <>
            {/* action dock */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, x: "-50%", opacity: 0 }}
                        animate={{ y: 20, x: "-50%", opacity: 1 }}
                        exit={{ y: -100, x: "-50%", opacity: 0 }}
                        className="fixed bottom-10 left-1/2 z-[100] flex items-center gap-6 px-6 py-3 bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full"
                    >
                        <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#255f6f] text-[10px] font-bold text-white">
                                {markedNotes.length}
                            </span>
                            <p className="text-sm font-medium text-[#255f6f]">Selected</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tooltip title="Deselect All" arrow>
                                <button 
                                    onClick={() => setMarkedNotes([])}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                                >
                                    <RemoveDoneIcon fontSize="small" />
                                </button>
                            </Tooltip>

                            <Tooltip title="Delete" arrow>
                                <button 
                                    onClick={() => setShowDeleteModal(true)}
                                    className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                                >
                                    <DeleteRoundedIcon fontSize="small" />
                                </button>
                            </Tooltip>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* delete modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl"
                        >
                            <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
                            <p className="mt-2 text-gray-500 text-sm">
                                You are about to delete {markedNotes.length} note(s). This action is permanent.
                            </p>

                            <div className="mt-6 flex gap-3">
                                <button 
                                    disabled={isPending}
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={isPending}
                                    onClick={handleDeleteNotes}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors flex justify-center items-center gap-2"
                                >
                                    {isPending ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default MarkedNotesActionsBar;