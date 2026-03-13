import { useQuery } from '@apollo/client/react'
import { useParams, Link } from 'react-router'
import { GetEventDocument } from '../../src/generated/graphql'
import { Card, CardContent } from '../../src/components/ui/card'
import { StarRating } from '../../src/components/StarRating'
import { ChevronLeft } from 'lucide-react'

export default function EventPage() {
  const { id } = useParams()
  const { loading, error, data } = useQuery(GetEventDocument, {
    variables: { id: id! },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data?.event) return <p>Event not found</p>

  const { event } = data

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft size={16} /> Events
      </Link>

      <div>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <Link to={`/events/${id}/feedback/new`} className="mt-2 inline-block text-sm text-primary underline">
          Submit feedback
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {event.feedback.map((fb) => (
          <Card key={fb.id}>
            <CardContent className="flex gap-4 pt-4">
              <div className="flex flex-col gap-1 min-w-[120px]">
                <StarRating rating={fb.rating} />
                <span className="text-sm text-muted-foreground">{fb.userName}</span>
              </div>
              <p className="text-sm">{fb.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
