import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useUpdateNotes = () => {
   const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({id_one, index_two, id_two, index_one}) => {
            // const {data, error} = await supabase.from('data')
            // .update({index_num: index_two})
            // .eq('id', id_one)


            const { data, error } = await supabase
            .from('data')
            .upsert([
                {id: id_one, index_num: index_two}, 
                {id: id_two, index_num: index_one}
                ])
            .select()

            if(error) console.log(error)

            // console.log("id", id_one)
            // console.log("index", index_two)
            // console.log("id", id_two)
            // console.log("index", index_one)

            return data

            // if(data) {
            //     const {data:data2, error:error2} = await supabase.from('data')
            //     .update({index_num: index_one})
            //     .eq('id', id_two)

            //     if(error2) console.log(error)

            //     return data2
            // }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: ['notes'],
            })

            console.log("Success")
        }
    })
}

export default useUpdateNotes