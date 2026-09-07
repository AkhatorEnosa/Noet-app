import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"
import { toast } from "react-toastify"

const useUpdateNotes = () => {
   const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({id_one, index_two, id_two, index_one}) => {

            // Use a unique temporary index value that won't conflict with existing notes
            // (real index_num values start at 2) or with temp values left behind by
            // earlier interrupted swaps. Negative keeps it sorting last if interrupted.
            const tempIndex = -(Date.now());

            // First move id_one to a temp index to free up its current value
            const { error: step1Error } = await supabase
                .from('notes')
                .update({ index_num: tempIndex })
                .eq('id', id_one)

            if (step1Error) throw step1Error

            // Next move id_two to id_one's original index
            const { error: step2Error } = await supabase
                .from('notes')
                .update({ index_num: index_one })
                .eq('id', id_two)

            if (step2Error) throw step2Error

            // Finally move id_one to id_two's original index
            const { error: step3Error } = await supabase
                .from('notes')
                .update({ index_num: index_two })
                .eq('id', id_one)

            if (step3Error) throw step3Error

            return { id_one, index_two, id_two, index_one }
        },
        onSuccess: () => {
            // Invalidate both pinned and unpinned notes queries to refresh the UI
            queryClient.invalidateQueries({ queryKey: ['pinnedNotes'] })
            queryClient.invalidateQueries({ queryKey: ['unpinnedNotes'] })
            // Refresh the tracked highest index_num after every creation
            queryClient.invalidateQueries({ queryKey: ['lastIndexNum'] })
        },
        onError: () => {
            toast.error("Oops! Problem update notes.", {
                className: "text-xs w-fit pr-24"
            })
        }
    })
}

export default useUpdateNotes