import { useQuery } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useTodos = () => {
    // const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['notes'],
        queryFn: async() => {
            const {data} = await supabase.from('data').select().order('id', {
                ascending: false
            });
            return data
        },
        refetchOnWindowFocus: false,
    })
}

export default useTodos