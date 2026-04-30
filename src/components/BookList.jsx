import { Component } from 'react'
import SingleBook from './SingleBook'
import CommentArea from './CommentArea'
import { Alert, Col, Form, Row } from 'react-bootstrap'

class BookList extends Component {
  state = {
    searchQuery: '',
    selectedBookAsin: '',
  }

  render() {
    const filteredBooks = this.props.books.filter((b) =>
      b.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    )

    const selectedBook = this.props.books.find(
      (book) => book.asin === this.state.selectedBookAsin
    )

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
                value={this.state.searchQuery}
                onChange={(e) => this.setState({ searchQuery: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-2 mt-3">
          {filteredBooks.map((b) => (
              <Col xs={12} md={4} key={b.asin}>
                <SingleBook
                  book={b}
                  selected={this.state.selectedBookAsin === b.asin}
                  onSelect={() =>
                    this.setState({
                      selectedBookAsin:
                        this.state.selectedBookAsin === b.asin ? '' : b.asin,
                    })
                  }
                />
              </Col>
            ))}
        </Row>

        {filteredBooks.length === 0 && (
          <Alert variant="warning" className="mt-4 text-center">
            Nessun libro trovato con questa ricerca.
          </Alert>
        )}

        {selectedBook && (
          <CommentArea
            asin={selectedBook.asin}
            bookTitle={selectedBook.title}
          />
        )}
      </>
    )
  }
}

export default BookList
