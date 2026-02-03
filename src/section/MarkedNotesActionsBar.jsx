import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { Tooltip } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import { motion } from "framer-motion";
import useDeleteNotes from "../hooks/useDeleteNotes";

const MarkedNotesActionsBar = () => {
    const { markedNotes, setMarkedNotes } = useContext(AppContext); // accessing the marked notes from context

    // component's states
    const [toggleAction, setToggleAction] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // hooks
    const { mutate, isPending } = useDeleteNotes()
    
    useEffect(() => {
        if (showDeleteModal) document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
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
        <div className={`sticky top-0 flex bg-white/10 backdrop-blur-md justify-between px-3 md:px-20 py-3 md:py-5 text-[#255f6f] ${showDeleteModal && "fixed top-0 left-0"} w-full ${markedNotes.length > 0 ? "scale-100" : "scale-0"} transition-all duration-300 ease-in-out z-[100]`}>
            <p className="text-lg font-semibold">{markedNotes.length} note{markedNotes.length > 1 ? "s" : ""} marked</p>

            {/* Action Button and Dropdown Menu */}
            <div className="flex gap-3">
                <Tooltip title="Actions" placement="top" arrow className="flex justify-center items-center cursor-pointer w-5 h-5 p-1 rounded-full  lg:bg-transparent lg:hover:bg-[#114f60]/20 pointer z-50" onClick={() => setToggleAction(!toggleAction)}>
                  <MoreVertIcon sx={{ fontSize: 28 }}/>
                </Tooltip>
                {toggleAction &&
                    <div className="absolute w-fit top-14 right-10 text-xs bg-white shadow-lg border-[0.2px] border-black/50 rounded-md overflow-hidden">
                        <ul>
                            <li className="flex justify-between items-center gap-5 hover:bg-gray-100 p-2 cursor-pointer" onClick={() => setMarkedNotes([]) & setToggleAction(false)}>Deselect All <RemoveDoneIcon sx={{ fontSize: 12 }} /></li>
                            <li className="flex justify-between hover:text-red-600 hover:bg-red-100/50 p-2 cursor-pointer" onClick={() => setShowDeleteModal(!showDeleteModal) & setToggleAction(false)}>Delete <DeleteRoundedIcon sx={{ fontSize: 12 }} /></li>
                        </ul>
                    </div>
                }
            </div>
            
            {/* Delete Confirmation Modal */}
            

        {/* Delete modal  */}
          {
            showDeleteModal &&(
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={"fixed w-screen h-screen top-0 left-0 flex px-6 justify-center items-center z-[100]"}>

                {/* backdrop  */}
                <div className={"w-screen h-screen fixed bg-black md:bg-black/75"} onClick={() => setShowDeleteModal(!showDeleteModal)}></div>

                <div className={`w-full h-fit md:w-96 md:h-auto flex flex-col gap-3 px-4 py-4 bg-white rounded-md transition-all duration-150 z-[60]`}>
                    <h1 className="text-lg font-semibold">Delete {markedNotes.length} Item{markedNotes.length > 1 ? "s" : ""}</h1>
                    <hr />
                    <p className="text-sm">Are you sure you want to Delete?</p>
                    <div className="w-full flex justify-center items-center gap-5 mt-5 text-sm">
                      {isPending ? <span className="loading loading-spinner loading-sm"></span> : <><button className="flex justify-center items-center p-3 hover:bg-[#ff2222] bg-error rounded-full text-sm text-white" onClick={handleDeleteNotes}><DeleteRoundedIcon />Yes, Delete</button>
                      <button className="flex justify-center items-center p-3 bg-neutral hover:bg-black text-white rounded-full" onClick={() => setShowDeleteModal(!showDeleteModal)}><ClearRoundedIcon/>Cancel</button></>}
                    </div> 
                </div>
            </motion.div>)
          }
        </div>
    )
}

export default MarkedNotesActionsBar