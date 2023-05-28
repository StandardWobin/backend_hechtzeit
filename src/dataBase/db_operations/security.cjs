

var utils = require('./utils.cjs');

module.exports = {
  // START OF DATA BASE QUERIES
  // LOGIN AND VERIFIVATION BEHAVIOR
  // SECURED
  // authentificate if the request has a correct token in the database
  validate_token: function (connection, logger, token, callback) {
    utils.checkparameters(logger, token, () => {
      var sql = 'SELECT 1 FROM tokens WHERE tokenvalue=' + connection.escape(token) + ' AND tokenexp > NOW();';
      logger.trace("DB", "- validate_token -  " + sql);
      connection.query(
        sql,
        function (err, rows) {
          if (err) {
            logger.error("DB", "- validate_token -  " + err + " using " + sql);
          }
          callback(err, rows[0]);
        }
      );
    })
  },

  // SECURED
  // insert new token or update persistens token
  insert_token: function (connection, logger, email, token) {
    var sql = 'SELECT * FROM tokens WHERE owner= (SELECT ID FROM user WHERE email=' + connection.escape(email) + ');';
    utils.checkparameters(logger, email, token, () => {
      logger.trace("DB", "- insert_token (check)-  " + sql);
      connection.query(sql, function (err, result) {
        if (err) {
          logger.error("DB", "- insert_token -  Am Error appeared in DB insert_token (DELETE) function: " + this.utils.stringify(err) + " using " + sql);
        } else {
          if (result.length < 1) {
            logger.info("DBs", "- insert_token (DELETE)-  " + sql);
            var sql2 = 'INSERT INTO tokens (tokenvalue, tokencreated, tokenexp, owner)\
                        VALUES (' + connection.escape(token) + ', NOW(), NOW() + INTERVAL 1 DAY, (SELECT ID FROM user WHERE email=' + connection.escape(email) + '));';
            logger.trace("DB", "- insert_token (INSERT) -  " + sql2);
            connection.query(sql2, function (err, result) {
              if (err) {
                logger.error("DB", "Am Error appeared in DB insert_token (INSERT) function: " + this.utils.stringify(err) + " using " + sql);
              }
            });
          } else {
            logger.trace("DB", "token already there, will be reniewd");
            var sql3 = 'UPDATE tokens set tokenvalue =' + connection.escape(token) + ', tokencreated=NOW(), tokenexp=NOW() + INTERVAL 1 DAY\
                        WHERE owner = (SELECT ID FROM user WHERE email=' + connection.escape(email) + ');'
            logger.trace("DB", "- insert_token (update) - sql: " + sql3);

            connection.query(sql3, function (err, result) {
              if (err) {
                logger.error("DB", "Am Error appeared in DB insert_token (INSERT) function: " + this.utils.stringify(err) + " using " + sql);
              }
            });
          }
        }
      });
    });
  },

  // SECURED
  // test if user in db
  get_user_by_email: function (connection, logger, email, callback) {
    // this function has some serios scalign and security issues....
    var sql = 'SELECT * FROM user WHERE email=' + connection.escape(email) + ';';
    logger.trace("DB", "- get_user_by_email -  " + sql);
    utils.checkparameters(logger, email, () => {
      return connection.query(sql, function (err, rows) {
        if (err) {
          logger.error("Am Error appeared in DB get_user_by_email function: " + this.utils.stringify(err) + "using" + sql);
        }
        callback(err, rows[0]);

      });
    })
  }



  


}
