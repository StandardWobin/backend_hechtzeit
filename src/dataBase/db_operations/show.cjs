
const path = require("path");
const fs = require("fs");

module.exports = {
  // scene change function for the front end module
  setApi: function (connection, dbConfig, logger, link, index, callback) {
    var sql = 'UPDATE ' + dbConfig.DB + '.relation_show_scene SET sceneAPI =' + connection.escape(index) + ' WHERE relation_show_scene.show=' + connection.escape(link) + '; SELECT customStageNumber FROM ' + dbConfig.DB + '.scene WHERE ID="' + connection.escape(index) + '";';
    logger.debug("DB - scene - setApi", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - setApi", err);
        }
        callback(rows[1][0].customStageNumber);
      }
    );
  },


  // scene change function for the front end module
  set: function (connection, dbConfig, logger, link, index, callback) {
    var sql = 'UPDATE ' + dbConfig.DB + '.relation_show_scene SET sceneAudience =' + connection.escape(index) + ' WHERE relation_show_scene.show=' + connection.escape(link) + '; SELECT sceneAudience FROM ' + dbConfig.DB + '.relation_show_scene WHERE relation_show_scene.show=' + connection.escape(link) + ';';
    logger.debug("DB - show - set", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - set", err);
        }

        console.log(err, rows)
        callback(rows[1][0].scene);
      }
    );
  },


  // SECURED
  // insert a new show in the databse
  insert_new: function (connection, dbConfig, logger, name, link, token, createSceneCallback, callback) {
    var sql = 'INSERT INTO ' + dbConfig.DB + '.show (name, link, owner, lastmod) VALUES\
                  (' + connection.escape(name) + ', ' + connection.escape(link) + ', \
                  (SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue=' + connection.escape(token) + '), NOW());';

    // safes the token in databse to ensure we can check alter if the user has right to acces
    logger.debug("DB - show - insert_new", sql);
    connection.query(sql, function (err, result) {
      if (err) {
        logger.error("DB - SHOW - insert_new", err);
        callback(err);
      }
      else {
        // no error 
        let data = { token: token, link: link }
        createSceneCallback(connection, dbConfig, logger, data, (error, results) => {
          if (error) {
            logger.error("DB - SHOW - insert_new (scene insert new)", error);
            callback(err);
          } else {
            let index = results[0].ID;
            let sql = 'INSERT INTO ' + dbConfig.DB + '.relation_show_scene (relation_show_scene.show, sceneAudience, sceneAPI) VALUES\
              (' + connection.escape(link) + ', ' + index + ', ' + index + ');'
      
            connection.query(sql, function (err, result) {
              logger.error("DB - SHOW - insert_new - insert reslation", err);
              callback(err);
            });
          }
        });
      }
    });
  },


  // todo: make this in the flying dutchman
  check_if_online: function (connection, dbConfig, logger, link, callback) {
    var sql = 'SELECT online FROM ' + dbConfig.DB + '.show WHERE ' + dbConfig.DB + '.show.link=LOWER(' + connection.escape(link) + ');';
    logger.debug("DB - show - check_if_online", sql);
    connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - check_if_online", err);
        }
        if (rows.length > 0) {
          callback(rows[0].online);
        }
      }
    );
  },


  get: function (connection, dbConfig, logger, link, token, callback) {
    // delete old token in database after user login in
    var sql = 'SELECT link, name, sceneAudience, sceneAPI, lastmod, online, link, offline_text, offline_name, title_image, api_key, stream_link\
     FROM ' + dbConfig.DB + '.show INNER JOIN ' + dbConfig.DB + '.relation_show_scene ON  ' + dbConfig.DB + '.show.link = ' + dbConfig.DB + '.relation_show_scene.show\
     WHERE link="' + link + '" AND owner=(SELECT ID from ' + dbConfig.DB + '.user WHERE ID=(SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue="' + token + '"));';   
    logger.debug("DB - show - get", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - get", err);
        }
        callback(err, rows);
      }
    );
  },


  get_by_token: function (connection, dbConfig, logger, token, callback) {
    /*
    does not provide the actual scene
    */
    var sql = 'SELECT link, ' + dbConfig.DB + '.show.name, lastmod, ' + dbConfig.DB + '.show.online, link, title_image as amount FROM ' + dbConfig.DB + '.show\
     WHERE owner=(SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue="' + token + '");';
    logger.debug("DB - show - get_by_token", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - get_by_token", err);
        }
        callback(err, rows);
      }
    );
  },


  get_by_link_for_non_admin: function (connection, dbConfig, logger, link, callback) {
    var sql = 'SELECT link, offline_name, offline_text, title_image, stream_link FROM ' + dbConfig.DB + '.show WHERE ' + dbConfig.DB + '.show.link=LOWER("' + link + '");';
    logger.debug("DB - show - get_by_link_for_non_admin", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - get_by_link_for_non_admin", err);
        }

        if (rows[0] === undefined) {
          logger.warn("DB - SHOW - get_by_link_for_non_admin", "UNDEFINED PUBLIC LINK PROTECTION");
          logger.warn("DB - SHOW - get_by_link_for_non_admin", "get_by_link_for_non_admin");
          return;
        }

        // HEADER IMAGE
        let imgPath = "public/" + rows[0].link + "/" + rows[0].title_image;
        const file = fs.readFileSync(imgPath)
        const extensionName = path.extname(imgPath);
        // convert image file to base64-encoded string
        const base64Image = Buffer.from(file, 'binary').toString('base64');
        // combine all strings
        const base64ImageStr = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;

        let logoPath = "public/" + rows[0].link + "/" + "logo.png";
        const fileLogo = fs.readFileSync(logoPath)
        const extensionNameLogo = path.extname(logoPath);
        // convert image file to base64-encoded string
        const base64ImageLogo = Buffer.from(fileLogo, 'binary').toString('base64');
        // combine all strings
        const base64ImageStrLogo = `data:image/${extensionNameLogo.split('.').pop()};base64,${base64ImageLogo}`;

        rows[0].image = base64ImageStr;
        rows[0].logo = base64ImageStrLogo;
        callback(err, rows);
      }
    );
  },


  get_active_scenes: function (connection, dbConfig, logger, link, callback) {
    // gets the order of the scene (order in list) which scene is actual live in the show
    var sql = 'SELECT ' + dbConfig.DB + '.relation_show_scene.sceneAudience, ' + dbConfig.DB + '.relation_show_scene.sceneAPI FROM ' + dbConfig.DB + '.relation_show_scene WHERE ' + dbConfig.DB + '.relation_show_scene.show=' + connection.escape(link) + ';';
    logger.debug("DB - show - get_active_scenes", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - get_active_scenes", err);
        }
        callback(err, rows);
      }
    );
  },


  update: function (connection, dbConfig, logger, data, callback) {
    // delete old token in database after user login in
    let temp = 0;
    if (data.online == true || data.online === true || data.online == 'true' || data.online === 'true') {
      temp = 1;
    }
    let sql = 'UPDATE ' + dbConfig.DB + '.show SET\
                ' + dbConfig.DB + '.show.name=' + data.name + ',\
                ' + dbConfig.DB + '.show.offline_text=' + data.offline_text + ',\
                ' + dbConfig.DB + '.show.offline_name=' + data.offline_name + ',\
                ' + dbConfig.DB + '.show.online=' + temp + ',\
                ' + dbConfig.DB + '.show.title_image=' + data.title_image + ',\
                ' + dbConfig.DB + '.show.api_key=' + data.api_key + ',\
                ' + dbConfig.DB + '.show.stream_link=' + data.stream_link + '\
                WHERE link=' + data.link + ';';

    logger.debug("DB - SHOW - UPDATE", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SHOW - UPDATE", err);
        }
        callback(err, rows[1]);
      }
    );
  },


  // SECURED
  // pulls all shows out the databse
  get_all_shows_by_token: function (connection, dbConfig, logger, data, callback) {
    throw new Error("THIS IS PROP DEPRACIATED AND CAN BE DELTED");
    this.checkparameters(data.token, () => {
      var sql = 'SELECT link, owner, name, lastmod, ' + dbConfig.DB + '.show.online, sceneamount, offline_name, offline_text, scene_stage, title_image\
                  FROM ' + dbConfig.DB + '.show LEFT JOIN (SELECT scene_frontend.show, count(scene_frontend.show) AS sceneamount FROM ' + dbConfig.DB + '.scene_frontend\
                  WHERE owner=(SELECT ID from ' + dbConfig.DB + '.user WHERE ID=(SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue=' + connection.escape(data.token) + '))\
                  group by scene_frontend.show) as temp ON ' + dbConfig.DB + '.show.link = temp.show WHERE owner=(SELECT ID from ' + dbConfig.DB + '.user WHERE ID=\
                  (SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue=' + connection.escape(data.token) + ')) ORDER BY ' + dbConfig.DB + '.show.lastmod;'
      logger.debug("DB - show - get_all_shows_by_token", sql);
      return connection.query(
        sql,
        function (err, rows) {
          if (err) {
            logger.error("DB - show - get_all_shows_by_token", err);
          }
          callback(err, rows);
        }
      );
    });
  },


  // SECURED
  // pulls all shows out the databse, if active
  get_all_links_if_active: function (connection, dbConfig, logger, callback) {
    var sql = 'SELECT link FROM ' + dbConfig.DB + '.show WHERE online = 1;'
    logger.debug("DB - show - get_all_links_if_active", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - show - get_all_links_if_active", err);
        }
        callback(err, rows);
      }
    );
  },


  // SECURED
  // pulls all shows out the databse, if active
  get_offline_shows: function (connection, dbConfig, logger, callback) {
    var sql = 'SELECT link FROM ' + dbConfig.DB + '.show WHERE online = 0;'
    logger.debug("DB - show - get_offline_shows", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - show - get_offline_shows", err);
        }
        callback(err, rows);
      }
    );
  },








  // SECURED
  // pulls all shows out the databse
  get_all_links: function (connection, dbConfig, logger, callback) {
    var sql = 'SELECT link FROM ' + dbConfig.DB + '.show;'
    logger.debug("DB - show - get_all_links", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - show - get_all_links", err);
        }
        callback(err, rows);
      }
    );
  },


  // SECURED
  // pulls all shows out the databse
  delete: function (connection, dbConfig, logger, link, token, callback) {
    throw new Error("DBMS CASCADING LOGIC MISSING....");
    var sql = "DELETE FROM " + dbConfig.DB + ".show where " + dbConfig.DB + ".show.link=" + connection.escape(link) + "\
                and " + dbConfig.DB + ".show.owner=(SELECT owner FROM " + dbConfig.DB + ".tokens where\
                tokenvalue=" + connection.escape(token) + ");";
    logger.debug("DB - show - delete", sql);
    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - show - delete", sql);
        }
        callback(err, rows);
      }
    );
  }
}

