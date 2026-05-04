import { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MyNav from './components/MyNav'
import MyFooter from './components/MyFooter'
import Welcome from './components/Welcome'
import { Alert, Container, Spinner } from 'react-bootstrap'
import BookList from './components/BookList'
import CommentArea from './components/CommentArea'

class App extends Component {
  state = {
    books: [],
    isLoading: false,
    errorMsg: '',
    selectedBookAsin: '',
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true })

    try {
      const response = await fetch('/data/fantasy.json')

      if (response.ok) {
        const books = await response.json()

        this.setState({
          books,
          isLoading: false,
          errorMsg: '',
        })
      } else {
        this.setState({
          isLoading: false,
          errorMsg: 'Non sono riuscita a caricare i libri.',
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
    const selectedBook = this.state.books.find(
      (book) => book.asin === this.state.selectedBookAsin
    )

    return (
      <>
        <MyNav />
        <main className="app-shell">
          <Container>
            <Welcome />

            {this.state.isLoading && (
              <div className="text-center my-5">
                <Spinner animation="border" variant="dark" />
              </div>
            )}

            {this.state.errorMsg && (
              <Alert variant="danger" className="mt-4 text-center">
                Errore: {this.state.errorMsg}
              </Alert>
            )}

            {!this.state.isLoading && !this.state.errorMsg && (
              <>
                <BookList
                  books={this.state.books}
                  selectedBookAsin={this.state.selectedBookAsin}
                  onSelectBook={(asin) =>
                    this.setState({
                      selectedBookAsin:
                        this.state.selectedBookAsin === asin ? '' : asin,
                    })
                  }
                />

                {selectedBook && (
                  <CommentArea
                    asin={selectedBook.asin}
                    bookTitle={selectedBook.title}
                  />
                )}
              </>
            )}
          </Container>
        </main>
        <MyFooter />
      </>
    )
  }
}

export default App
