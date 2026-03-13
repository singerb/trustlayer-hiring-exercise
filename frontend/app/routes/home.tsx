import { useQuery } from '@apollo/client/react'
import { GetEventsDocument } from '../../src/generated/graphql'

export default function Home() {
  const { loading, error, data } = useQuery(GetEventsDocument)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      {data?.events?.map((event) => (
        <p key={event.id} className="text-xl">{event.name}</p>
      ))}
    </>
  )
}
