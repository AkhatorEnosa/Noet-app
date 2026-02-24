import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { signOut } from "../reducers/appSlice"
import { toast } from "react-toastify"

const useSignOut = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async() => {
            const result = await dispatch(signOut());
            return result.payload;
        },
        onSuccess: () => {
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