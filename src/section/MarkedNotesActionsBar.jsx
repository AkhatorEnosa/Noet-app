import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Tooltip } from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import { motion, AnimatePresence } from "framer-motion";
import useDeleteNotes from "../hooks/useDeleteNotes";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

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
                toast.success(markedNotes.length > 1 ? "Notes Deleted Succesfully" : "Note Deleted Succesfully", {
                    className: "text-xs w-fit pr-24"
                })
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
                <ConfirmModal
                    action={showDeleteModal}
                    setAction={setShowDeleteModal}
                    pending={isPending}
                    handleConfirm={handleDeleteNotes}
                    title={markedNotes.length > 1 ? "Delete Notes?" : "Delete Note?"}
                    desc={`You are about to delete ${markedNotes.length > 1 ? "notes" : "notes"}. This action is permanent. Are you sure you want to proceed? `}
                />
            </AnimatePresence>
        </>
    );
}

export default MarkedNotesActionsBar;