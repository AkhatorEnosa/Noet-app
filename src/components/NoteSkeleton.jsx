
const NoteSkeleton = () => {
  return (
    <div className="w-full break-inside-avoid mb-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse mt-6">
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded-t-lg mx-3 mt-3 w-3/4"></div>
      
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* Footer skeleton */}
      <div className="px-3 pb-3 flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
};

export default NoteSkeleton;