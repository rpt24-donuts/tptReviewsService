/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/extensions */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Review from './review.jsx';
import Sort from './sort.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: 0,
      reviews: [],
      sort: {
        ratings: undefined,
        grades: undefined,
        population: undefined,
      },
      grades: [],
    };
    this.getReviews = this.getReviews.bind(this);
    this.addHelpful = this.addHelpful.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }

  componentDidMount() {
    console.log(window.location.pathname.split('/')[2]*1);
    this.setState({productId: window.location.pathname.split('/')[2]*1 || 5}, () => this.getReviews());

  //   axios.get(`/${this.state.productId}/reviews/`)
  //     .then((results) => this.setState({ reviews: results.data.reviews, grades: results.data.grades }));
  }

  onSortChange(e) {
    let oldSort = { ...this.state.sort };
    oldSort[e.target.id] = (e.target.value === '0') ? undefined : e.target.value;
    this.setState({ sort: oldSort }, this.getReviews);
  }

  getReviews() {
    axios.get(`http://localhost:3001/products/${this.state.productId}/reviews?ratings=${this.state.sort.ratings || false}&grades=${this.state.sort.grades || false}`)
      .then((results) => this.setState(
        {
          reviews: results.data.reviews, grades: results.data.grades,
        },
      ));
  }

  addHelpful(reviewId) {
    axios.put(`http://localhost:3001/helpful/${reviewId}`)
      .then((results) => this.getReviews());
  }

  render() {
    const reviews = this.state.reviews.map((review, key) => <Review review={review} helpful={this.addHelpful} key={key}/>);
    return (
      <div>
        <img src="http://localhost:3001/Stats.png" id="chartimg"></img>
        <Sort grades={this.state.grades} onSort={this.onSortChange} />
        {reviews}
      </div>
    );
  }
}

export {App};
