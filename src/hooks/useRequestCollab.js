import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

const useRequestCollab = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, noteId, ownerId }) => {
      if (!userId || !noteId || !ownerId) {
        throw new Error("Missing required IDs to process collaboration.");
      }

      // Check for existing collaboration
      const { data: existing, error: fetchError } = await supabase
        .from('collaborations')
        .select('*')
        .eq('user_requesting', userId)
        .eq('note_id', noteId)
        .eq('owner_id', ownerId)
        .maybeSingle();

      if (fetchError) throw fetchError;
          if (existing) {
              // 2. If it exists, DELETE it
              const { error: deleteError } = await supabase
                  .from('collaborations')
                  .delete()
                  .eq('id', existing.id);

              if (deleteError) throw deleteError;
              return { status: 'removed', data: null };
          } else {
            // Insert if it doesn't exist
            const { data, error: insertError } = await supabase
                .from('collaborations')
                .insert([{ user_requesting: userId, note_id: noteId, owner_id: ownerId }])
                .select()
                .single();

            if (insertError) throw insertError;
            return data;
          }
    },
    onSuccess: () => {
      // Refresh queries so the UI knows the user is now a collaborator
      return queryClient.invalidateQueries({
        queryKey: ['publicNote'],
      });
    },
    onError: (error) => {
      console.error("Collaboration Error:", error.message);
    }
  })
}

export default useRequestCollab;