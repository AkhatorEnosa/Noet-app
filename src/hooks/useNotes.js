import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shuffleNoets } from "../reducers/apiSlice";
import { useDispatch } from "react-redux";


const useNotes = () => {
    const dispatch = useDispatch();
    // const user = useSelector((state) => state.data.user)

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({id, sortValue, searchInput}) => {
            const result = dispatch(shuffleNoets({id: id, filter: sortValue, searchInput}))

            return result
        },
        onSuccess: (result) => {
            console.log("Notes loaded", result)
            queryClient.invalidateQueries({
                queryKey: ['notes'],
              })
        },
        onError: (error) => {
            console.log("Notes Mutation Failed", error)
        }
    })
}

export default useNotes