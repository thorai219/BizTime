/** Database setup for BizTime. */
const { Client } = require('pg');


let DB_URI = "postgresql///:biztime";

let db = new Client({
  connectionString: BD_URI
});

db.connect();

module.exports = db;