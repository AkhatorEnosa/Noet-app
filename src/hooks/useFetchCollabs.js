import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux";
import { checkCollabStatus } from "../reducers/publicNoteSlice";

const useFetchCollabs = (userId, noteId) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.app.user)

    return useQuery({
        queryKey: ['publicNote', userId, noteId],
        queryFn: async() => {
            if(userId !== null && noteId !== null){
                const result = await dispatch(checkCollabStatus({ userId: user?.id, noteId }));
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

export default useFetchCollabs