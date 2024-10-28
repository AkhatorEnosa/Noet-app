import { useQuery } from "@tanstack/react-query"
import { fetchData } from "../reducers/apiSlice";
import { useDispatch } from "react-redux";

const useNotes = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['notes'],
        queryFn: async() => {
            const result = await dispatch(fetchData());
            return result.payload;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true
    });

    // return useQuery({
    //     queryKey: ['notes'],
    //     queryFn: async() => {
    //         const {data} = await supabase.from('data').select().order('id', {
    //             ascending: false
    //         });
    //         return data
    //     },
    //     refetchOnWindowFocus: false,
    //     refetchOnReconnect: true,
    // })
}

export default useNotes