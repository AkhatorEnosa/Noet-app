import { useInfiniteQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import { getAllNotes } from "../reducers/notesSlice"

const useInfiniteUnpinnedNotes = (filter, searchInput) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.app.user)

  return useInfiniteQuery({
    queryKey: ['unpinnedNotes', user?.id, filter, searchInput],
    queryFn: async ({ pageParam = 0 }) => {
      if (user !== null) {
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