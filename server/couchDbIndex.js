const couchimport = require('couchimport');

const { login } = require('./couchCredentials.js');

const { couchUser, couchPwd } = login;

const nano = require('nano')(`http://${couchUser}:${couchPwd}@localhost:5984`);

const couchDBName = 'tpt_reviews';

// destroy the database if it exists

async function seedCouchDB() {
  // check if couchDB exist, and if so delete it
  const dblist = await nano.db.list();
  const exists = dblist.indexOf(couchDBName) > -1;
  if (exists) {
    await nano.db.destroy(couchDBName);
  }
  await nano.db.create(couchDBName);

  //const couchDB = nano.use(couchDBName);



}

seedCouchDB();
