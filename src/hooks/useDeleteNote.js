import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useDeleteNote = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
        mutationFn: async(id) => {
                const {data, error} = await supabase
                .from('data')
                .delete()
                .eq('id', id)

                if(error) throw error
                return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notes'],
              })
        },
        onError: (error) => {
            console.log("Mutation Failed", error)
        }
    })
}

export default useDeleteNote