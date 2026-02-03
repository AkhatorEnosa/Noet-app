import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useDeleteNotes = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
        mutationFn: async(ids) => {
                const {data, error} = await supabase
                .from('data')
                .delete()
                .in('id', ids)

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

export default useDeleteNotes