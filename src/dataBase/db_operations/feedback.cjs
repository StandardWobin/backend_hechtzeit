const scene = require("./scene.cjs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');

module.exports = {
  // this need more security


  // HEREHERE
  accept: function (connection, dbConfig, logger, link, sceneid, feedbackid, callback) {
    let sql = "UPDATE " + dbConfig.DB + ".scene_responses SET needmod=0 where\
              scene_responses.show=" + connection.escape(link) + "\
              and global_scene_id=" + connection.escape(sceneid) + "\
              and needmod=1 and ID=" + connection.escape(feedbackid) + ";\
              SELECT * from " + dbConfig.DB + ".scene_responses where\
              scene_responses.show=" + connection.escape(link) + "\
              and global_scene_id=" + connection.escape(sceneid) + "\
              and needmod=0 and ID=" + connection.escape(feedbackid) + ";\
              SELECT customStageNumber from " + dbConfig.DB + ".scene WHERE\
               id=" + connection.escape(sceneid) + ";";

    logger.debug("DB - FEEDBACK - accept", sql);
    connection.query(sql, function (err, result) {

      if (err) {
        logger.error("DB - FEEDBACK - accept", err);
      } else {

        result[1][0].ID = sceneid;
        result[1][0].customStageNumber = result[2][0].customStageNumber;

        if (result[1][0].scenetype == 4 || result[1][0].scenetype == 5 || result[1][0].scenetype == 7) {
          console.log("need to load data from file", result[1][0]);

          let suffix = result[1][0].scenetype != 5 ? "images" : "audio";

          let filePath = "data/" + result[1][0].show + "/" + suffix + "/" + result[1][0].message;
          fs.readFile(filePath, function (err, data) {
            if (err) throw err;

            if (suffix == "images") {
              const extensionName = path.extname(filePath);
              const file = fs.readFileSync(filePath)

              const base64Image = Buffer.from(file, 'binary').toString('base64');

              const base64ImageStr = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
              result[1][0].message = base64ImageStr;
            } else {
              result[1][0].message = Buffer.from(data, 'binary');
            }
            // convert image file to base64-encoded string
            // combine all strings

            // convert image file to base64-encoded string
            // combine all strings            
            callback(result[1][0]);

          });
        } else {
          callback(result[1][0]);

        }
      }
    });
  },


  handle: function (connection, dbConfig, logger, message, callback) {

    let sql = "";
    let messagecontent = message.message;
    if (message.scene.type == 4) {
      console.log("image", message.message)

      let code = uuidv4();
      let filename = encodeURIComponent(message.username.replace("/", "").replace("\\", "").replace(".", "")) + "." + code;
      let show = encodeURIComponent(message.scene.show.replace("/", "").replace("\\", "").replace(".", ""))
      var file = "./data/" + show + "/images/" + filename;

      /*base64.decode(data, { fname: 'example', ext: 'jpeg' });
      base64.decode(message.message, { fname: 'NONexample', ext: 'jpeg' });*/
      // strip off the data: url prefix to get just the base64-encoded bytes
      var cut = message.message.replace(/^data:image\/\w+;base64,/, ""); // remove prefix
      var buf2 = Buffer.from(cut, 'base64');                              // decode BASE64
      fs.writeFileSync(file + '.png', buf2, (err) => { console.log(err) })
      messagecontent = filename + '.png';
    }

    if (message.scene.type == 5) {
      let code = uuidv4();
      let filename = encodeURIComponent(message.username.replace("/", "").replace("\\", "").replace(".", "")) + "." + code;
      let show = encodeURIComponent(message.scene.show.replace("/", "").replace("\\", "").replace(".", ""))
      var file = "./data/" + show + "/audio/" + filename;

      fs.writeFile(file + ".wav", message.message, (err) => { console.log(err) })
      messagecontent = filename + ".wav";

    }

    if (message.scene.type == 7) {
      let code = uuidv4();
      let filename = encodeURIComponent(message.username.replace("/", "").replace("\\", "").replace(".", "")) + "." + code;
      let show = encodeURIComponent(message.scene.show.replace("/", "").replace("\\", "").replace(".", ""))
      var file = "./data/" + show + "/images/" + filename;

      var buf2 = Buffer.from(message.message, 'base64');                              // decode BASE64
      fs.writeFileSync('test' + '.png', buf2, (err) => { console.log(err) })
      messagecontent = filename + '.png';
    }

    if (messagecontent.length > 450) {
      console.log("the string is to long for the databse");
      return
    }

    console.log(message.scene.ID)
    sql = 'INSERT INTO ' + dbConfig.DB + '.scene_responses (' + dbConfig.DB + '.scene_responses.show, scene, scenetype, message, needmod, username, socketid, ip, agent, datecon, datainit, token, global_scene_id)\
              VALUES (\
                        ' + connection.escape(message.scene.show) + ',\
                        ' + connection.escape(message.scene.ID) + ',\
                        ' + connection.escape(message.scene.type) + ',\
                        ' + connection.escape(messagecontent) + ',\
                        (SELECT moderate from scene where scene.ID=(SELECT sceneAudience from ' + dbConfig.DB + '.relation_show_scene where relation_show_scene.show=' + connection.escape(message.scene.show) + ') and  scene.show=' + connection.escape(message.scene.show) + '),\
                        ' + connection.escape(message.username) + ',\
                        ' + connection.escape(message.socketid) + ',\
                        ' + connection.escape(message.ip) + ',\
                        ' + connection.escape(message.agent) + ',\
                        ' + 'NOW(3)' + ',\
                        ' + connection.escape(message.time) + ',\
                        ' + connection.escape(message.token) + ',\
                        ' + connection.escape(message.scene.ID) + ');\
                        SELECT * FROM ' + dbConfig.DB + '.scene_responses WHERE ID = LAST_INSERT_ID();'

    logger.debug("DB - FEEDBACK - handle", sql);

    connection.query(sql, function (err, result) {
      if (err) {
        logger.error("DB - FEEDBACK - handle", err);
      } else {
        message.insertId = result[0].insertId;
        callback(message, result[1][0].needmod);
      }
    });
  },


  compile: function (connection, dbConfig, logger, link, ID, type, callback) {
    let sql = "";
    // MC
    if (type == 2 || type == 1) {
      sql = "SELECT t.ID, t.message, r.maxdate\
                FROM (\
                      SELECT ID, message, MAX(datecon) as Maxdate\
                      FROM " + dbConfig.DB + ".scene_responses WHERE scene_responses.show=" + connection.escape(link) + "\
                      AND  scene=" + ID + "\
                      AND scene_responses.scenetype=" + connection.escape(type) + "\
                      AND datecon > (SELECT feedbackuntil FROM scene where ID=" + ID + ")\
                      GROUP BY token\
                ) r\
                INNER JOIN " + dbConfig.DB + ".scene_responses t ON t.datecon = r.Maxdate;";
    }

    // pusher
    else if (type == 3) {
      sql = "SELECT \
        (SELECT Count(*) FROM scene_responses  WHERE datecon > (SELECT feedbackuntil FROM scene where ID=" + ID + ") and scene_responses.show=" + connection.escape(link) + " and scenetype =" + connection.escape(type) + " and global_scene_id=" + connection.escape(ID) + " and message=1) as first,\
        (SELECT Count(*) FROM scene_responses  WHERE datecon > (SELECT feedbackuntil FROM scene where ID=" + ID + ") and scene_responses.show=" + connection.escape(link) + " and scenetype  =" + connection.escape(type) + " and global_scene_id=" + connection.escape(ID) + " and message=2) as second,\
        (SELECT Count(*) FROM scene_responses  WHERE datecon > (SELECT feedbackuntil FROM scene where ID=" + ID + ") and scene_responses.show=" + connection.escape(link) + " and scenetype  =" + connection.escape(type) + " and global_scene_id=" + connection.escape(ID) + " and message=3) as third,\
        (SELECT Count(*) FROM scene_responses  WHERE datecon > (SELECT feedbackuntil FROM scene where ID=" + ID + ") and scene_responses.show=" + connection.escape(link) + " and scenetype  =" + connection.escape(type) + " and global_scene_id=" + connection.escape(ID) + " and message=4) as fourth;";
    }

    else {
      callback();
      return;
    }

    logger.debug("DB - FEEDBACK - compile", sql);
    connection.query(sql, function (err, rows) {
      if (err) {
        logger.error("DB - FEEDBACK - compile", err);
      } else {
        callback(rows);
      }
    });
  },




  reset: function (connection, dbConfig, logger, token, ID, callback) {
    sql = 'UPDATE ' + dbConfig.DB + '.scene SET feedbackuntil = now() WHERE ID=' + ID + ';';
    logger.debug("DB - FEEDBACK - reset", sql);

    connection.query(sql, (err, result) => {
      if (err) {
        logger.error("Am Error appeared in DB reset:", err, "using", sql);
      } else {
        callback(err, result);
      }
    });
  }
}
