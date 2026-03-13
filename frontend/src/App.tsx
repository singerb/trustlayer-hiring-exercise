import { useQuery } from '@apollo/client/react'
import { GetEventsDocument } from './generated/graphql'
import './App.css'

function App() {
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

export default App
