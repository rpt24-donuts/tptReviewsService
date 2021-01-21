const { review } = require('./mongodb.js');

const model = {
  put: (reviewId, callback) => {
    review.find(reviewId)
      .then((results) => {
        console.log('results ', results);
        callback(null, results);
      })
      .catch((err) => {
        console.log('err ', err);
        callback(err);
      });
  },
};

module.exports = model;
