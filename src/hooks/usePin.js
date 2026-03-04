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
            return queryClient.invalidateQueries({
                queryKey: ['notes'],
            });
        }
    })
}

export default usePin