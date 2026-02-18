import { useMutation} from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { signIn } from "../reducers/appSlice"
import { toast } from "react-toastify"

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
            toast.error("Oops! Error Signing In.", {
            className: "text-xs w-fit pr-24"
            })
        }
    })
}

export default useLogin