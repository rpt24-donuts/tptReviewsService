const { review } = require('./mongodb.js');

const model = {
  create: (reviewToCreate, callback) => {
    review.create(reviewToCreate)
      .then((results) => {
        callback(null, results);
      })
      .catch((err) => {
        callback(err);
      });
  },
  put: (reviewId, updateFields, callback) => {
    review.findOneAndUpdate(reviewId, updateFields, { new: true, useFindAndModify: false })
      .then((results) => {
        callback(null, results);
      })
      .catch((err) => {
        callback(err);
      });
  },
  delete: (reviewId, callback) => {
    review.deleteOne(reviewId)
      .then((success) => {
        callback(null, success);
      })
      .catch((err) => {
        callback(err);
      });
  },
};

module.exports = model;
