import { useMutation} from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { signIn } from "../reducers/apiSlice"

const useLogin = () => {
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async() => {
            const result = await dispatch(signIn());
            return result.payload;
        },
        onSuccess: () => {
           console.log("Signing In")
        },
        onError: (error) => {
            console.error("Error signing in", error)
        }
    })
}

export default useLogin