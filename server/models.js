const { review } = require('./mongodb.js');

const model = {
  put: (reviewId, updateFields, callback) => {
    // validate grade and standard inputs
    console.log('updateFields ', updateFields);
    review.findOneAndUpdate(reviewId, updateFields, { new: true, useFindAndModify: false })
      .then((results) => {
        callback(null, results);
      })
      .catch((err) => {
        callback(err);
      });
  },
};

module.exports = model;
