// this script reads a file an excecutes it (sql)
import  dbConfig from "../../../hidden/db/db.config.js";
import mysql from "mysql";
import fs from "fs";

var connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  port: dbConfig.PORT,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: true,
});

// SECURED
// test if user in db
function create_shema_from_file(file) {
  // this function has some serios scalign and security issues....

  const dataSql = fs.readFileSync(file).toString();

  return connection.query(dataSql, function (err, res) {
    err ? console.log(err) : () => {};
    res ? console.log("OK - tables created") : () => {};
  });
}

connection.connect();
create_shema_from_file("./src/dataBase/admin_tools/shema.sql");
connection.end();