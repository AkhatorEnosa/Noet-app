import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"
// import { toast } from "react-toastify"

const usePin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updatePin) => {
            const {data, error} = await supabase.from('notes')
            .update(updatePin)
            .eq('id', updatePin.id)

            if(error) console.log(error)

            return data
        },
        onSuccess: () => {
            // Returning this ensures the mutation promise 
            // resolves only AFTER the refetch completes, so the UI will update with the new pinned status immediately
            return queryClient.invalidateQueries({
                queryKey: ['notes'],
            });
        }
    })
}

export default usePin