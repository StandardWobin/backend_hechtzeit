import  dbConfig from "../../../hidden/db/db.config.js";
import mysql from "mysql";

var connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  port: dbConfig.PORT,
  password: dbConfig.PASSWORD,
  multipleStatements: true,
});

// SECURED
// test if user in db
function create_shema_from_file() {
  // this function has some serios scalign and security issues....
  const sql = "CREATE SCHEMA " + dbConfig.DB + ";";
  return connection.query(sql, function (err, res) {
    err ? console.log(err) : () => {};
    res ? console.log("OK - schema " + dbConfig.DB + " created") : () => {};
  });
}


function configure_group_by() {
  // this function has some serios scalign and security issues....
  const sql = "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));";
  return connection.query(sql, function (err, res) {
    err ? console.log(err) : () => {};
    res ? console.log("OK - GROUP BY RESTRICTION REMOVED") : () => {};
  });
}

connection.connect();
create_shema_from_file();
configure_group_by();

connection.end();