const mongoose = require('mongoose');
//const key = require('./mongokey.js');
//ongoose.connect('mongodb://54.176.228.90:27017/reviews', { useNewUrlParser: true });
mongoose.connect(`mongodb://localhost/reviews`, { useNewUrlParser: true,  useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected');
});

const reviewsSchema = new mongoose.Schema({
  description: String,
  title: String,
  rating: Number,
  helpful: Number,
  user: String,
  productId: Number,
  grade: Array,
  standards: Array,
});

const Review = mongoose.model('Review', reviewsSchema);



// Review.collection.drop({});

const firstValue = new Review({ description: 'Description', alignment: ['1', '2'] });

firstValue.save((err, review) => {
  if (err) {
    console.log(err);
  } else {

  }
});

module.exports = { db, review: Review, schema: reviewsSchema };
