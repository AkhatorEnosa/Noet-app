import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux";
import { getAllNoets } from "../reducers/apiSlice";

const useFetchNotes = (id, filter, searchInput) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user)

    return useQuery({
        queryKey: ['notes', user, id, filter, searchInput],
        queryFn: async() => {
            if(user !== null){
                const result = await dispatch(getAllNoets({id: user?.id, filter, searchInput}));
                return result;
            } else {
                return null
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    });

}

export default useFetchNotes