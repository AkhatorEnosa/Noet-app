import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"


const useRequestCollab = () => {
    const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, noteId, ownerId}) => {
        try {
            if (!userId || !noteId || ownerId) throw new Error("Missing userId or noteId");

            // Look for an existing collaboration first
            const { data: existing, error: fetchError } = await supabase
                .from('collaborations')
                .select('*')
                .eq('user_requesting', userId)
                .eq('note_id', noteId)
                .eq('owner_id', ownerId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') throw fetchError; // PGRST116 means "no rows found"

            // If already existing, return
            if (existing) {
                return existing; 
            }

            // 3. If no duplicate, proceed with insertion
            const { data, error: insertError } = await supabase
                .from('collaborations')
                .insert([{ user_requesting: userId, note_id: noteId, owner_id: ownerId }])
                .select();

            if (insertError) throw insertError;
            if (data) {
                console.log(data)
                return data[0];
            }

        } catch (error) {
            return error.message;
        }
    },
    onSuccess: () => {
      // console.log("Created", data)
        queryClient.invalidateQueries({
          queryKey: ['publicNote'],
        })
    },
    onError: (error) => {
        console.log("Create Mutation Failed", error)
    }
  })
}

export default useRequestCollab