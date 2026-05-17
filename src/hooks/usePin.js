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
            // Invalidate both pinned and unpinned notes queries to refresh the UI
            queryClient.invalidateQueries({ queryKey: ['pinnedNotes'] })
            queryClient.invalidateQueries({ queryKey: ['unpinnedNotes'] })
        }
    })
}

export default usePin