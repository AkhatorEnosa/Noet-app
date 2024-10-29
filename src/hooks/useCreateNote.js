import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"


const useCreateNote = () => {
    const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newNote) => {
        const {data, error} = await supabase.from('data').insert(newNote)

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

export default useCreateNote