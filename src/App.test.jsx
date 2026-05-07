import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import fantasyBooks from './data/fantasy.json'

const reviewedBook = fantasyBooks[0]
const secondBook = fantasyBooks[1]

const mockedComments = [
  {
    _id: 'comment-1',
    comment: 'Bellissimo libro',
    rate: 5,
    elementId: reviewedBook.asin,
  },
  {
    _id: 'comment-2',
    comment: 'Molto interessante',
    rate: 4,
    elementId: reviewedBook.asin,
  },
]

const mockFetch = () => {
  global.fetch = vi.fn((url) => {
    if (url === '/data/fantasy.json') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fantasyBooks),
      })
    }

    if (url === `https://striveschool-api.herokuapp.com/api/comments/${reviewedBook.asin}`) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedComments),
      })
    }

    if (typeof url === 'string' && url.startsWith('https://striveschool-api.herokuapp.com/api/comments/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    }

    return Promise.reject(new Error('Unexpected fetch call'))
  })
}

const renderApp = async () => {
  mockFetch()
  render(<App />)
  await screen.findByText(/Benvenuti in EpiBooks!/i)
  await waitFor(() =>
    expect(screen.getAllByTestId('single-book-card')).toHaveLength(
      fantasyBooks.length
    )
  )
}

describe('EpiBooks app', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('mounts the Welcome component correctly', async () => {
    await renderApp()

    expect(
      screen.getByRole('heading', { name: /Benvenuti in EpiBooks!/i })
    ).toBeInTheDocument()
  })

  it('renders as many book cards as the books in the json file', async () => {
    await renderApp()

    expect(screen.getAllByTestId('single-book-card')).toHaveLength(
      fantasyBooks.length
    )
  })

  it('renders the CommentArea correctly', async () => {
    await renderApp()

    expect(screen.getByTestId('comment-area')).toBeInTheDocument()
    expect(
      screen.getByText(/Seleziona un libro dalla griglia/i)
    ).toBeInTheDocument()
  })

  it('filters books through the search input', async () => {
    await renderApp()

    const searchInput = screen.getByPlaceholderText(/Cerca un libro/i)
    await userEvent.type(searchInput, 'last wish')

    expect(
      screen.getByText(/The Last Wish: Introducing the Witcher/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Sword of Destiny/i)
    ).not.toBeInTheDocument()
  })

  it('changes the border color when a book is clicked', async () => {
    await renderApp()

    const bookTitle = screen.getByText(reviewedBook.title)
    const bookCard = bookTitle.closest('[data-testid="single-book-card"]')

    await userEvent.click(bookCard)

    const updatedBookCard = screen
      .getByText(reviewedBook.title)
      .closest('[data-testid="single-book-card"]')

    expect(updatedBookCard).toHaveAttribute('data-selected', 'true')
  })

  it('resets the first book border when a second book is clicked', async () => {
    await renderApp()

    const firstBookCard = screen
      .getByText(reviewedBook.title)
      .closest('[data-testid="single-book-card"]')
    const secondBookCard = screen
      .getByText(secondBook.title)
      .closest('[data-testid="single-book-card"]')

    await userEvent.click(firstBookCard)
    await userEvent.click(secondBookCard)

    const updatedFirstBookCard = screen
      .getByText(reviewedBook.title)
      .closest('[data-testid="single-book-card"]')
    const updatedSecondBookCard = screen
      .getByText(secondBook.title)
      .closest('[data-testid="single-book-card"]')

    expect(updatedFirstBookCard).toHaveAttribute('data-selected', 'false')
    expect(updatedSecondBookCard).toHaveAttribute('data-selected', 'true')
  })

  it('does not render any SingleComment on initial page load', async () => {
    await renderApp()

    expect(screen.queryAllByTestId('single-comment')).toHaveLength(0)
  })

  it('loads and renders comments when clicking a book with reviews', async () => {
    await renderApp()

    const bookCard = screen
      .getByText(reviewedBook.title)
      .closest('[data-testid="single-book-card"]')

    await userEvent.click(bookCard)

    expect(
      await screen.findByText(/Recensioni di/i)
    ).toBeInTheDocument()

    const commentArea = screen.getByTestId('comment-area')
    const comments = await within(commentArea).findAllByTestId('single-comment')

    expect(comments).toHaveLength(mockedComments.length)
    expect(screen.getByText(/Bellissimo libro/i)).toBeInTheDocument()
  })
})
