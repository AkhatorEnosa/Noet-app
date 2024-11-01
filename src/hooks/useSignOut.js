import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signOut } from "../reducers/apiSlice"
import { useDispatch } from "react-redux"

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