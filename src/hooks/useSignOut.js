import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "../reducers/appSlice"
import { toast } from "react-toastify"
import { clearCachedNotes, clearCachedUser } from "../utils/offlineCache"

const useSignOut = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.app.user)
  
    return useMutation({
        mutationFn: async() => {
            const result = await dispatch(signOut());
            return result.payload;
        },
        onSuccess: () => {
            // Clear cached notes and user for offline data
            if (user?.id) {
                clearCachedNotes(user.id);
            }
            clearCachedUser();
            return queryClient.removeQueries({
                queryKey: ["user"]
            })
        },
        onError: (error) => {
            console.error("Error signing out", error)
            toast.error("Error Signing Out.", {
                className: "text-xs w-fit pr-24"
            })
        }
    })
}

export default useSignOut