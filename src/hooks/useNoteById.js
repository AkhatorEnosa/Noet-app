import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import supabase from "../config/supabaseClient.config";

/**
 * Hook to fetch a single note by its ID for the logged-in user.
 * This is used when a URL param matches a note ID, allowing the note
 * to be opened even if it hasn't been loaded via infinite scroll.
 * 
 * @param {string|number} noteId - The ID of the note to fetch
 * @returns {Object} React Query result with the note data
 */
const useNoteById = (noteId) => {
  const user = useSelector((state) => state.app.user);

  return useQuery({
    queryKey: ['noteById', noteId, user?.id],
    queryFn: async () => {
      if (!user || !noteId) return null;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .eq('user_id', user.id)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!noteId && !!user,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: false, // Don't retry if note not found
  });
};

export default useNoteById;