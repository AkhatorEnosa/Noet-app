import { useQuery } from "@tanstack/react-query"
import { fetchData } from "../reducers/apiSlice";
import { useDispatch, useSelector } from "react-redux";

const useNotes = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user)

    return useQuery({
        queryKey: ['notes'],
        queryFn: async() => {
            const result = dispatch(fetchData(user.id))
            if(result !== undefined) {
                return result;
            } else {
                return null
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true
    })
}

export default useNotes