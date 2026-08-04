import { useInfiniteQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import { getAllNotes } from "../reducers/notesSlice"
import { getCachedNotes, isOnline } from "../utils/offlineCache"
import useOfflineStatus from "./useOfflineStatus"

const useInfiniteUnpinnedNotes = (filter, searchInput) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.app.user)
  const online = useOfflineStatus()

  return useInfiniteQuery({
    queryKey: ['unpinnedNotes', user?.id, filter, searchInput, online],
    queryFn: async ({ pageParam = 0 }) => {
      if (user !== null) {
        // If offline, return cached notes directly
        if (!isOnline()) {
          const cachedNotes = getCachedNotes(user?.id);
          if (cachedNotes) {
            const unpinnedNotes = cachedNotes.filter(note => note.pinned === false);
            const filtered = searchInput
              ? unpinnedNotes.filter(note =>
                  (note.data_value || '').toLowerCase().includes(searchInput.toLowerCase())
                )
              : unpinnedNotes;
            const sorted = [...filtered].sort((a, b) => {
              const aVal = a[filter] ?? 0;
              const bVal = b[filter] ?? 0;
              if (typeof aVal === 'string') return bVal.localeCompare(aVal);
              return bVal - aVal;
            });
            const from = pageParam * 12;
            const to = from + 12;
            const pagedNotes = sorted.slice(from, to);
            return {
              notes: pagedNotes,
              hasMore: to < sorted.length,
              totalCount: sorted.length,
            };
          }
          return { notes: [], hasMore: false, totalCount: 0 };
        }

        const result = await dispatch(getAllNotes({
          id: user?.id,
          filter,
          searchInput,
          pinned: false,
          page: pageParam,
          limit: 12
        }))
        return result.payload
      }
      
      return null
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.hasMore ? pages.length : undefined
    },
    initialPageParam: 0,
    placeholderData: (previousData) => previousData, // Keep previou data while fetching
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })
}

export default useInfiniteUnpinnedNotes