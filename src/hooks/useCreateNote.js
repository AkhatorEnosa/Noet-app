import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"
import { toast } from "react-toastify"


const useCreateNote = () => {
    const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newNote) => {
        const {data, error} = await supabase.from('notes').insert(newNote)

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
        toast.error("Oops! Could not create note.", {
          className: "text-xs w-fit pr-24"
        })
    }
  })
}

export default useCreateNote