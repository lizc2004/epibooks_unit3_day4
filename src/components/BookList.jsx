import { useState } from 'react'
import SingleBook from './SingleBook'
import CommentArea from './CommentArea'
import { Alert, Col, Form, Row } from 'react-bootstrap'

function BookList({ books }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBookAsin, setSelectedBookAsin] = useState('')

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedBook = books.find((book) => book.asin === selectedBookAsin)

  return (
    <>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={4} className="text-center">
          <Form.Group>
            <Form.Control
              id="book-search"
              name="book-search"
              type="search"
              placeholder="Cerca un libro"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="g-4 mt-3 align-items-start">
        <Col xs={12} lg={8}>
          <Row className="g-3">
            {filteredBooks.map((b) => (
              <Col xs={12} md={6} xl={4} key={b.asin}>
                <SingleBook
                  book={b}
                  selected={selectedBookAsin === b.asin}
                  onSelect={() =>
                    setSelectedBookAsin((currentAsin) =>
                      currentAsin === b.asin ? '' : b.asin
                    )
                  }
                />
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={12} lg={4}>
          <div className="comment-area-wrapper">
            <CommentArea
              asin={selectedBookAsin}
              bookTitle={selectedBook?.title || ''}
            />
          </div>
        </Col>
      </Row>

      {filteredBooks.length === 0 && (
        <Alert variant="warning" className="mt-4 text-center">
          Nessun libro trovato con questa ricerca.
        </Alert>
      )}
    </>
  )
}

export default BookList
