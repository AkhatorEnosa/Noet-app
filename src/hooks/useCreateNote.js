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
      // console.log("Created", data)
        queryClient.invalidateQueries({
          queryKey: ['notes'],
        })
    },
    onError: (error) => {
        console.log("Create Mutation Failed", error)
    }
  })
}

export default useCreateNote