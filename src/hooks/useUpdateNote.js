import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"
import { toast } from "react-toastify"

const useUpdateNote = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updateNote) => {
            const {data, error} = await supabase.from('notes')
            .update(updateNote)
            .eq('id', updateNote.id)

            if(error) console.log(error)

            return data
        },
        onSuccess: () => {
            // console.log("Note Updated Successfully")
            return queryClient.invalidateQueries({
                queryKey: ['notes'],
            })
        }, 
        onError: (error) => {
            console.log(error)
            toast.error("Oops! Could not update note.", {
                className: "text-xs w-fit pr-24"
            })
        }
    })
}

export default useUpdateNote;