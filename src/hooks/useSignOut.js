import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { signOut } from "../reducers/appSlice"

const useSignOut = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async() => {
            const result = await dispatch(signOut());
            return result.payload;
        },
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ["user"]
            })
        },
        onError: (error) => {
            console.error("Error signing out", error)
        }
    })
}

export default useSignOut