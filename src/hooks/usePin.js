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
            // toast.success("Note pinned, check pinned notes", {
            //     className: "text-xs w-fit pr-24"
            // });
            queryClient.invalidateQueries({
                queryKey: ['notes'],
            });
        }
    })
}

export default usePin