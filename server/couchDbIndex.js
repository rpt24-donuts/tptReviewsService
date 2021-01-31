const path = require('path');
const couchimport = require('couchimport');

const { login } = require('./couchCredentials.js');

const { couchUser, couchPwd } = login;
const couchUrl = `http://${couchUser}:${couchPwd}@localhost:5984`;

const nano = require('nano')(couchUrl);

const couchDBName = 'tpt_reviews';

const seedFile = path.join(__dirname, 'reviews.tsv');

async function seedCouchDB() {
  // check if couchDB exist, and if so delete it
  const dblist = await nano.db.list();
  const exists = dblist.indexOf(couchDBName) > -1;
  if (exists) {
    await nano.db.destroy(couchDBName);
  }
  await nano.db.create(couchDBName);

  const options = { delimiter: '\t', url: couchUrl, database: couchDBName };

  // import random data from tsv to couchdb
  await couchimport.importFile(seedFile, options, (err, res) => {
    if (err) {
      console.log('error uploading the seedFile ', err);
    } else {
      console.log('success uploading the seedFile ', res);
    }
  });
}

seedCouchDB();
