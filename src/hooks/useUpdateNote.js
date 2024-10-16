import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useUpdateNote = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newTodo, id) => {
            const {data, error} = await supabase.from('data')
            .update(newTodo)
            .eq('id', id)

            if(error) console.log(error)

            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: ['notes'],
            })
        }
    })
}

export default useUpdateNote