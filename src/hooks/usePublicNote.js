import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getPublicNoteViaParam } from "../reducers/publicNoteSlice";


const usePublicNote = (param) => {
    const dispatch = useDispatch();
    // const user = useSelector((state) => state.app.user)

    return useQuery({
        queryKey: ['publicNote', param],
        queryFn: () => {
            // if(user !== null){
                const result = dispatch(getPublicNoteViaParam({param}));
                return result;
            // } else {
            //     return null
            // }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    });
}

export default usePublicNote