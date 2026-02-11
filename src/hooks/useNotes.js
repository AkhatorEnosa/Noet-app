import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getPublicNoteViaParam } from "../reducers/apiSlice";


const useNotes = (id, param) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user)

    return useQuery({
        queryKey: ['notes', user, id, param],
        queryFn: async() => {
            if(user !== null){
                const result = await dispatch(getPublicNoteViaParam({userId: user?.id, param}));
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

export default useNotes