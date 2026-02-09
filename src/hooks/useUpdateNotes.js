import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useUpdateNotes = () => {
   const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({id_one, index_two, id_two, index_one}) => {

            const { data, error } = await supabase
            .from('data')
            .upsert([
                {id: id_one, index_num: index_two}, 
                {id: id_two, index_num: index_one}
                ])
            .select()

            if(error) console.log(error)

            // console.log("id_one", id_one)
            // console.log("index_two", index_two)
            // console.log("id_two", id_two)
            // console.log("index_one", index_one)

            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notes'],
              })
        }
    })
}

export default useUpdateNotes