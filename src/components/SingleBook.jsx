import { Component } from 'react'
import { Card } from 'react-bootstrap'

class SingleBook extends Component {
  render() {
    return (
      <Card
        className="h-100"
        onClick={this.props.onSelect}
        style={{
          border: this.props.selected ? '3px solid red' : '1px solid #dee2e6',
          cursor: 'pointer',
        }}
      >
        <Card.Img variant="top" src={this.props.book.img} />
        <Card.Body>
          <Card.Title style={{ color: 'black' }}>
            {this.props.book.title}
          </Card.Title>
        </Card.Body>
      </Card>
    )
  }
}

export default SingleBook
