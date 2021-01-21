const { review } = require('./mongodb.js');

const model = {
  put: (reviewId, updateFields, callback) => {
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
