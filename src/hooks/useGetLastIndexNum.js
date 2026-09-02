import { useQuery } from "@tanstack/react-query"
import supabase from "../config/supabaseClient.config"

/**
 * Fetches the highest index_num across ALL of the user's notes directly
 * from the server. Unlike reading from loaded query pages, this is not
 * affected by pagination, current sort order, or stale cache, so a new
 * note created with lastIndexNum + 2 can never collide with an
 * existing index (prevents Postgres error 23505).
 */
const useGetLastIndexNum = (uid) => {
  return useQuery({
    queryKey: ['lastIndexNum', uid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('index_num')
        .eq('user_id', uid)
        .order('index_num', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data?.index_num ?? 0
    },
    enabled: !!uid, // only run when we have a user id
    staleTime: 0, // always refetch when invalidated
  })
}

export default useGetLastIndexNum