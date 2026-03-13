import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { GetEventDocument } from '../../src/generated/graphql'

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
    <div>
      <h1 className="text-2xl">{event.name}</h1>
      <ul className="mt-4">
        {event.feedback.map((fb) => (
          <li key={fb.id} className="mt-2">
            <p className="font-semibold">{fb.userName} — {fb.rating}/5</p>
            <p>{fb.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
