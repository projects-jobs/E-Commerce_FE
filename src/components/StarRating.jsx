// src/components/StarRating.jsx
export function StarRating({ rating = 0, size = 14, showNum = false, count = 0, interactive = false, onRate }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s}
          width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#f97316' : '#e7e5e4'}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
          onClick={() => interactive && onRate?.(s)}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      {showNum && count > 0 && (
        <span className="text-xs text-ink-400 ml-1">({count})</span>
      )}
    </div>
  )
}
export default StarRating