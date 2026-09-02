import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"
import { toast } from "react-toastify"


const useCreateNote = () => {
    const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newNote) => {
      const insertNote = (payload) =>
        supabase.from('notes').insert(payload).select().single()

      let { data, error } = await insertNote(newNote)

      // Safety net: if index_num collided with an existing note (Postgres 23505),
      // fetch the true highest index_num for this user and retry once.
      if (error?.code === '23505') {
        const { data: lastNote } = await supabase
          .from('notes')
          .select('index_num')
          .eq('user_id', newNote.user_id)
          .order('index_num', { ascending: false })
          .limit(1)
          .maybeSingle()

        const retryResult = await insertNote({
          ...newNote,
          index_num: (lastNote?.index_num ?? 0) + 2,
        })

        data = retryResult.data
        error = retryResult.error
      }

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalidate both pinned and unpinned notes queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['pinnedNotes'] })
      queryClient.invalidateQueries({ queryKey: ['unpinnedNotes'] })
      // Refresh the tracked highest index_num after every creation
      queryClient.invalidateQueries({ queryKey: ['lastIndexNum'] })
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