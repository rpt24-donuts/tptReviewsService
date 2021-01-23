const { review } = require('./mongodb.js');

const model = {
  put: (reviewId, updateFields, callback) => {
    // handle incorrect inputs
    const wrongFormat = 'wrong format';
    const typeOfTitle = typeof updateFields.title; // should be string
    const typeOfDescription = typeof updateFields.description; // should be string
    const standardsIsArray = Array.isArray(updateFields.standards); // should be array
    const gradeIsArray = Array.isArray(updateFields.standards); // should be array

    if (typeOfTitle !== 'string') {
      callback(wrongFormat);
    } else if (typeOfDescription !== 'string') {
      callback(wrongFormat);
    } else if (!standardsIsArray) {
      callback(wrongFormat);
    } else if (!gradeIsArray) {
      callback(wrongFormat);
    } else {
      // if all inputs have the valid format, then update the entry in the database
      review.findOneAndUpdate(reviewId, updateFields, { new: true, useFindAndModify: false })
        .then((results) => {
          callback(null, results);
        })
        .catch((err) => {
          callback(err);
        });
    }
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
