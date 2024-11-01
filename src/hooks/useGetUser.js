import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getUser } from "../reducers/apiSlice";

const useGetUser = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['user'],
        queryFn: async() => {
            const result = await dispatch(getUser());
            return result.payload;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    });

}

export default useGetUser