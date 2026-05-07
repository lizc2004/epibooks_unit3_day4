import { Card } from 'react-bootstrap'

function SingleBook({ book, selected, onSelect }) {
  return (
    <Card
      className="h-100"
      onClick={onSelect}
      style={{
        border: selected ? '3px solid red' : '1px solid #dee2e6',
        cursor: 'pointer',
      }}
    >
      <Card.Img variant="top" src={book.img} />
      <Card.Body>
        <Card.Title style={{ color: 'black' }}>{book.title}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default SingleBook
