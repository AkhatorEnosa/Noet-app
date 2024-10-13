import { useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useTodos = () => {
    // const queryClient = useQueryClient()

    return useQueryClient({
        queryKey: ['todos'],
        queryFn: async() => {
            const {data} = await supabase.from('data').select()
            return data
        }
    })
}

export default useTodos