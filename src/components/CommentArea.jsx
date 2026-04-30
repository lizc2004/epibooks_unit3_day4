import { Component } from 'react'
import { Alert, Card, ListGroup, Spinner } from 'react-bootstrap'
import { API_TOKEN, API_URL } from '../apiConfig'

class CommentArea extends Component {
  state = {
    comments: [],
    isLoading: false,
    errorMsg: '',
  }

  componentDidMount() {
    this.fetchComments()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.asin !== this.props.asin) {
      this.fetchComments()
    }
  }

  fetchComments = async () => {
    this.setState({
      isLoading: true,
      errorMsg: '',
    })

    try {
      const response = await fetch(`${API_URL}${this.props.asin}`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      })

      if (response.ok) {
        const comments = await response.json()

        this.setState({
          comments,
          isLoading: false,
          errorMsg: '',
        })
      } else {
        this.setState({
          isLoading: false,
          errorMsg: 'Non sono riuscita a caricare i commenti.',
        })
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        errorMsg: error.message,
      })
    }
  }

  render() {
    return (
      <Card className="mt-4 shadow-sm">
        <Card.Body>
          <Card.Title>Recensioni di {this.props.bookTitle}</Card.Title>

          {this.state.isLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="dark" />
            </div>
          )}

          {this.state.errorMsg && (
            <Alert variant="danger" className="mt-3 mb-0">
              Errore: {this.state.errorMsg}
            </Alert>
          )}

          {!this.state.isLoading &&
            !this.state.errorMsg &&
            this.state.comments.length === 0 && (
              <p className="mb-0 text-secondary">
                Non ci sono ancora recensioni per questo libro.
              </p>
            )}

          {!this.state.isLoading &&
            !this.state.errorMsg &&
            this.state.comments.length > 0 && (
              <ListGroup variant="flush" className="mt-3">
                {this.state.comments.map((comment) => (
                  <ListGroup.Item key={comment._id}>
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
}

export default CommentArea
