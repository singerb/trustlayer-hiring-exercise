import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router'
import { GetEventsDocument } from '../../src/generated/graphql'

export default function Home() {
  const { loading, error, data } = useQuery(GetEventsDocument)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      {data?.events?.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`}>
          <p className="text-xl">{event.name}</p>
        </Link>
      ))}
    </>
  )
}
