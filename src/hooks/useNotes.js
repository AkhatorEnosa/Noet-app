import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../reducers/apiSlice";
import { useDispatch } from "react-redux";


const useNotes = () => {
    const dispatch = useDispatch();
    // const user = useSelector((state) => state.data.user)

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({id, sortValue, searchInput}) => {
            const result = dispatch(fetchData({id: id, filter: sortValue, searchInput}))

            return result
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: ['notes'],
            })
        }
    })
}

export default useNotes