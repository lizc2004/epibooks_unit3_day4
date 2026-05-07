import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MyNav from './components/MyNav'
import MyFooter from './components/MyFooter'
import Welcome from './components/Welcome'
import { Alert, Container, Spinner } from 'react-bootstrap'
import BookList from './components/BookList'

function App() {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)

      try {
        const response = await fetch('/data/fantasy.json')

        if (response.ok) {
          const booksData = await response.json()

          setBooks(booksData)
          setErrorMsg('')
        } else {
          setErrorMsg('Non sono riuscita a caricare i libri.')
        }
      } catch (error) {
        setErrorMsg(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return (
    <>
      <MyNav />
      <main className="app-shell">
        <Container>
          <Welcome />

          {isLoading && (
            <div className="text-center my-5">
              <Spinner animation="border" variant="dark" />
            </div>
          )}

          {errorMsg && (
            <Alert variant="danger" className="mt-4 text-center">
              Errore: {errorMsg}
            </Alert>
          )}

          {!isLoading && !errorMsg && (
            <BookList books={books} />
          )}
        </Container>
      </main>
      <MyFooter />
    </>
  )
}

export default App
