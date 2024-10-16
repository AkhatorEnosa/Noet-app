import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"


const useCreateTodo = () => {
    const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newTodo) => {
        const {data, error} = await supabase.from('data').insert(newTodo)

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

export default useCreateTodo