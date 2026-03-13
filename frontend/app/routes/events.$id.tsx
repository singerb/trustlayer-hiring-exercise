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

  return (
    <h1 className="text-2xl">{data.event.name}</h1>
  )
}
