import { useEffect, useState } from 'react'
import { Alert, Card, ListGroup, Spinner } from 'react-bootstrap'
import { API_TOKEN, API_URL } from '../apiConfig'

function CommentArea({ asin, bookTitle }) {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!asin) {
      setComments([])
      setIsLoading(false)
      setErrorMsg('')
      return
    }

    const fetchComments = async () => {
      setIsLoading(true)
      setErrorMsg('')

      try {
        const response = await fetch(`${API_URL}${asin}`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        })

        if (response.ok) {
          const commentsData = await response.json()

          setComments(commentsData)
          setErrorMsg('')
        } else {
          setErrorMsg('Non sono riuscita a caricare i commenti.')
        }
      } catch (error) {
        setErrorMsg(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [asin])

  return (
    <Card className="shadow-sm comment-area-card" data-testid="comment-area">
      <Card.Body>
        {!asin && (
          <>
            <Card.Title>CommentArea</Card.Title>
            <p className="mb-0 text-secondary">
              Seleziona un libro dalla griglia per vedere qui le recensioni.
            </p>
          </>
        )}

        {asin && <Card.Title>Recensioni di {bookTitle}</Card.Title>}

        {asin && isLoading && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="dark" />
          </div>
        )}

        {asin && errorMsg && (
          <Alert variant="danger" className="mt-3 mb-0">
            Errore: {errorMsg}
          </Alert>
        )}

        {asin && !isLoading && !errorMsg && comments.length === 0 && (
          <p className="mb-0 text-secondary">
            Non ci sono ancora recensioni per questo libro.
          </p>
        )}

        {asin && !isLoading && !errorMsg && comments.length > 0 && (
          <ListGroup variant="flush" className="mt-3">
            {comments.map((comment) => (
              <ListGroup.Item key={comment._id} data-testid="single-comment">
                <div className="fw-semibold">Voto: {comment.rate}/5</div>
                <div>{comment.comment}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  )
}

export default CommentArea
