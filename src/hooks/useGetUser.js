import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getUser } from "../reducers/appSlice";

const useGetUser = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['user'],
        queryFn: async() => {
            const result = await dispatch(getUser());
            if(result.payload != undefined) {
                return result.payload;
            } else {
                return null
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    });

}

export default useGetUser