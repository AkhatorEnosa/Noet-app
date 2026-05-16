import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import NoteSkeleton from './NoteSkeleton'

/* eslint-disable react/prop-types */
const LoadSentinel = ({ onLoadMore, hasNextPage, isFetchingNextPage }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore()
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore])

  return (
    <div ref={ref} className="w-full">
      {isFetchingNextPage && (
        <div className="space-y-4">
          <NoteSkeleton />
        </div>
      )}
    </div>
  )
}

export default LoadSentinel