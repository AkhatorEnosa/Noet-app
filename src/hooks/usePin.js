import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const usePin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updatePin) => {
            const {data, error} = await supabase.from('data')
            .update(updatePin)
            .eq('id', updatePin.id)

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

export default usePin