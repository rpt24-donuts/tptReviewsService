const { review } = require('./mongodb.js');

const pool = require('./postgresdb.js');

const model = {
  find: (productId, callback) => {
    const query = {
      text: 'SELECT * FROM reviews WHERE productID = $1',
      values: [productId],
    };
    pool.query(query)
      .then((results) => {
        // parse stings into arryas
        for (let i = 0; i < results.rows.length; i += 1) {
          // parse the grade array
          if (results.rows[i].grade.length <= 2) {
            results.rows[i].grade = [];
          } else {
            var gradeString = results.rows[i].grade.substring(1, results.rows[i].grade.length -1);
            var gradeStringArray = gradeString.split(',');
            results.rows[i].grade = gradeStringArray;
          }
          // parse the standards array (temp solution, need to find a better way)
          if (results.rows[i].standards.length <= 2) {
            results.rows[i].standards = [];
          } else {
            results.rows[i].standards = [results.rows[i].standards];
            }
        }
        // reassing to make this work with the frontend
        const resultsForFE = {
          reviews: results.rows,
          grades: ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'],
        };
        callback(null, resultsForFE);
      })
      .catch((err) => {
        callback(err);
      });
  },
  create: (reviewToCreate, callback) => {
    const query = {
      text: 'INSERT INTO reviews (productid, username, title, description, rating, standards, grade) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      // eslint-disable-next-line max-len
      values: [reviewToCreate.productId, reviewToCreate.user, reviewToCreate.title, reviewToCreate.description, reviewToCreate.rating, reviewToCreate.standards, reviewToCreate.grade],
    };
    pool.query(query)
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
