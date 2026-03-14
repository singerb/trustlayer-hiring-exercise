import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useParams, Link } from 'react-router'
import { GetEventDocument, FeedbackAddedDocument } from '../../src/generated/graphql'
import { Card, CardContent } from '../../src/components/ui/card'
import { StarRating } from '../../src/components/StarRating'
import { ChevronLeft } from 'lucide-react'

const PAGE_SIZE = 10

export default function EventPage() {
  const { id } = useParams()
  const [minEnabled, setMinEnabled] = useState(false)
  const [minRating, setMinRating] = useState(1)
  const [maxEnabled, setMaxEnabled] = useState(false)
  const [maxRating, setMaxRating] = useState(5)
  const [page, setPage] = useState(1)

  const filterVars = {
    minRating: minEnabled ? minRating : undefined,
    maxRating: maxEnabled ? maxRating : undefined,
  }

  const paginationVars = { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE }

  const { loading, error, data, subscribeToMore } = useQuery(GetEventDocument, {
    variables: { id: id!, ...filterVars, ...paginationVars },
  })

  useEffect(() => {
    if (!id || page !== 1) return
    return subscribeToMore({
      document: FeedbackAddedDocument,
      variables: { eventId: id, ...filterVars },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || !prev.event) return prev
        const newFeedback = subscriptionData.data.feedbackAdded
        return {
          ...prev,
          event: {
            ...prev.event,
            feedback: [newFeedback, ...prev.event.feedback],
          },
        }
      },
    })
  }, [id, subscribeToMore, minEnabled, minRating, maxEnabled, maxRating, page])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data?.event) return <p>Event not found</p>

  const { event } = data
  const totalPages = Math.ceil(event.feedbackCount / PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft size={16} /> Events
      </Link>

      <div>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <Link to={`/events/${id}/add-feedback`} className="mt-2 inline-block text-sm text-primary underline">
          Submit feedback
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={minEnabled} onChange={e => { setMinEnabled(e.target.checked); setPage(1) }} />
          Min stars:
          <input type="number" min={1} max={5} value={minRating} disabled={!minEnabled}
            onChange={e => { setMinRating(Number(e.target.value)); setPage(1) }} className="w-16 border rounded px-1" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={maxEnabled} onChange={e => { setMaxEnabled(e.target.checked); setPage(1) }} />
          Max stars:
          <input type="number" min={1} max={5} value={maxRating} disabled={!maxEnabled}
            onChange={e => { setMaxRating(Number(e.target.value)); setPage(1) }} className="w-16 border rounded px-1" />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{event.feedbackCount} {event.feedbackCount === 1 ? 'review' : 'reviews'}</p>
        {event.feedback.map((fb) => (
          <Card key={fb.id} className="animate-in slide-in-from-top-2 fade-in-0 duration-300">
            <CardContent className="flex gap-4 pt-4">
              <div className="flex flex-col gap-1 min-w-[120px]">
                <StarRating rating={fb.rating} />
                <span className="text-sm text-muted-foreground">{fb.userName}</span>
              </div>
              <p className="text-sm">{fb.description}</p>
            </CardContent>
          </Card>
        ))}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-40">
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-40">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
