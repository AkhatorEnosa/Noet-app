import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"
import { toast } from "react-toastify"

const useDeleteNotes = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
        mutationFn: async(ids) => {
                const {data, error} = await supabase
                .from('notes')
                .delete()
                .in('id', ids)

                if(error) throw error
                return data
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({
                queryKey: ['notes'],
              })
        },
        onError: (error) => {
            console.log("Mutation Failed", error)
            toast.error("Oops! Could not delete note.", {
                className: "text-xs w-fit pr-24"
            })
        }
    })
}

export default useDeleteNotes