function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-12 bg-gray-200 rounded animate-pulse"
          style={{ width: `${100 - (index % 3) * 10}%` }}
        ></div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
