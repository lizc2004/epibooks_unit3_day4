import { Component } from 'react'
import SingleBook from './SingleBook'
import { Alert, Col, Form, Row } from 'react-bootstrap'

class BookList extends Component {
  state = {
    searchQuery: '',
  }

  render() {
    const filteredBooks = this.props.books.filter((b) =>
      b.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
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
                selected={this.props.selectedBookAsin === b.asin}
                onSelect={() => this.props.onSelectBook(b.asin)}
              />
            </Col>
          ))}
        </Row>

        {filteredBooks.length === 0 && (
          <Alert variant="warning" className="mt-4 text-center">
            Nessun libro trovato con questa ricerca.
          </Alert>
        )}
      </>
    )
  }
}

export default BookList
