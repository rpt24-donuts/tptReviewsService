// generate 10M review records to eventually upload in the two databases of choice
const faker = require('faker');
const gaussian = require('gaussian');
const fs = require('fs');

// generate a random number of reviews per product, distributed normally
const reviewsPerProductDistribution = gaussian(5, 2);

const writeReviews = fs.createWriteStream('reviews.tsv');
writeReviews.write('productId\tuser\ttitle\tdescription\trating\thelpful\tgrade\tstandards\n', 'utf-8');

const dataGen = (writer, encoding, callback) => {
  let i = 10000000;
  function write() {
    let ok = true;
    do {
      // eslint-disable-next-line max-len
      const numberReviews = Math.max(Math.floor(reviewsPerProductDistribution.ppf(Math.random())), 0);
      for (let j = 0; j < numberReviews; j += 1) {
        const review = {};
        review.description = faker.lorem.paragraph();
        review.title = faker.lorem.sentence();
        review.rating = Math.floor(Math.random() * 5) + 1;
        review.helpful = Math.floor(Math.random() * 25) + 1;
        review.user = faker.name.findName();
        review.productId = i;

        const gradeArray = [];
        const grades = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'];
        for (let m = 0; m < Math.floor(Math.random() * 3); m += 1) {
          gradeArray.push(grades[Math.floor(Math.random() * 5)]);
        }
        // do this to be able to store the object in the tsv file
        review.grade = JSON.stringify(gradeArray);

        review.standards = [];
        const standards = [['CCSS', 'RI. 6.2'], ['CCSS', '3.NF.A.1'], ['TKO', '12.4f']];
        for (let n = 0; n < Math.floor(Math.random() * 3); n += 1) {
          const obj = {
            standard: standards[Math.floor(Math.random() * 3)].join(' '),
            alignment: Math.floor(Math.random() * 5) + 1,
          };
          // do this to be able to store the object in the tsv file
          const stringifiedObj = JSON.stringify(obj);

          review.standards.push(stringifiedObj);
        }

        const data = `${review.productId}\t${review.user}\t${review.title}\t${review.description}\t${review.rating}\t${review.helpful}\t${review.grade}\t${review.standards}\n`;
        if (i === 0 && j === numberReviews - 1) {
          writer.write(data, encoding, callback);
        } else {
          ok = writer.write(data, encoding);
        }
      }
      i -= 1;
      if (i % 1000000 === 0) { console.log('i ', i); }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
};

dataGen(writeReviews, 'utf-8', () => {
  writeReviews.end();
});
