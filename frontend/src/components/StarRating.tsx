import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: number
}

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 > 0
  const empty = 5 - full - (hasHalf ? 1 : 0)

  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalf && <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-muted-foreground" />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
    </span>
  )
}
