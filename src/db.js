var mysql = require('mysql');
const CONFIG = require('./config');


var pool = mysql.createPool({
  connectionLimit:10,
  host: CONFIG.DB.host,
  user: CONFIG.DB.user,
  password: CONFIG.DB.password,
  database: CONFIG.DB.name
});

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;