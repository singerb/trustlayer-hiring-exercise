import { useQuery } from '@apollo/client/react'
import { GetBooksDocument } from './generated/graphql'
import './App.css'

function App() {
  const { loading, error, data } = useQuery(GetBooksDocument)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>


  return (
    <>
      {data?.books?.map((book, i) => (
        <p key={i} className="text-xl">{book?.title} by {book?.author}</p>
      ))}
    </>
  )
}

export default App
