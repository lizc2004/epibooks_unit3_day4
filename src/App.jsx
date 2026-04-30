import { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MyNav from './components/MyNav'
import MyFooter from './components/MyFooter'
import Welcome from './components/Welcome'
import { Alert, Container, Spinner } from 'react-bootstrap'
import BookList from './components/BookList'

class App extends Component {
  state = {
    books: [],
    isLoading: false,
    errorMsg: '',
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
              <BookList books={this.state.books} />
            )}
          </Container>
        </main>
        <MyFooter />
      </>
    )
  }
}

export default App
