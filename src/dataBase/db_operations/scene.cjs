


module.exports =  {
  insert_new: function (connection, dbConfig, logger, data, callback) {
    // delete old token in database after user login in
    var sql = 'INSERT INTO ' + dbConfig.DB + '.scene (scene.show, owner, created, scene.order) VALUES ("' + data.link + '", \
                  (SELECT ID from ' + dbConfig.DB + '.user WHERE ID=\
                      (SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue="' + data.token + '")),\
                      now(),\
                  ' + '(select IFNULL(MAX(temp.order)+1, 0) from (select * from ' + dbConfig.DB + '.scene where scene.show="' + data.link + '"' + ') as temp));\
                SELECT * FROM ' + dbConfig.DB + '.scene WHERE ID = LAST_INSERT_ID();';

    logger.debug("DB - SCENE - insert_new", sql);

    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SCENE - insert_new", err);
        }
        callback(err, rows[1]);
      }
    );
  },


  update: function (connection, dbConfig, logger, scene, callback) {
    // TODO: check and test input...

    // FIX DATATYPE
    scene.title_noop === undefined ? scene.title_noop = "\"\"" : () => { }
    scene.answer_text_1 === undefined ? scene.answer_text_1 = "\"\"" : () => { }
    scene.answer_text_2 === undefined ? scene.answer_text_2 = "\"\"" : () => { }
    scene.answer_text_3 === undefined ? scene.answer_text_3 = "\"\"" : () => { }
    scene.answer_text_4 === undefined ? scene.answer_text_4 = "\"\"" : () => { }
    scene.answer_text_5 === undefined ? scene.answer_text_5 = "\"\"" : () => { }
    scene.answer_text_6 === undefined ? scene.answer_text_6 = "\"\"" : () => { }
    scene.sendbuttontext === undefined ? scene.sendbuttontext = "\"\"" : () => { }
    scene.explaintext === undefined ? scene.explaintext = "\"\"" : () => { }
    scene.size === undefined ? scene.size = 0 : () => { }
    scene.mc_type === undefined ? scene.mc_type = 0 : () => { }
    scene.title === undefined ? scene.title = "\"\"" : () => { }
    scene.show_eval === undefined ? scene.show_eval = false : () => { }
    scene.live === undefined ? scene.live = false : () => { }
    scene.disabled === undefined ? scene.disabled = false : () => { }
    scene.reuse === undefined ? scene.reuse = false : () => { }

    scene.cooldown === undefined ? scene.cooldown = 0 : () => { }
    scene.countdown === undefined ? scene.countdown = 0 : () => { }
    scene.countdownstart === undefined ? scene.countdownstart = null : () => { }
    scene.moderate === undefined ? scene.moderate = null : () => { }
    scene.customStageNumber === undefined ? scene.customStageNumber = null : () => { }

    // get old scene type...

    let customsql = "";

    if (scene.type == 0) {
      // noop, just a text an title and text and a icon
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_noop\
        (global_scene_id, title_noop, icon_noop, text_noop) VALUES\
        (\
        " + connection.escape(scene.ID) + ",\
        IFNULL(" + connection.escape(scene.tile_noop) + ",title_noop),\
        IFNULL(" + connection.escape(scene.icon_noop) + ",icon_noop),\
        IFNULL(" + connection.escape(scene.text_noop) + ",text_noop)\
        )\
        ON DUPLICATE KEY UPDATE \
        title_noop=IFNULL(" + connection.escape(scene.title_noop) + ",title_noop),\
        icon_noop=IFNULL(" + connection.escape(scene.icon_noop) + ",icon_noop),\
        text_noop=IFNULL(" + connection.escape(scene.text_noop) + ",text_noop)\
        ;";
    } else if (scene.type == 1) {
      // multiple choice
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_mc\
        (global_scene_id, title_mc, size_mc, text_mc, answer_text_1, answer_text_2,\
            answer_text_3, answer_text_4, answer_text_5, answer_text_6, \
            sendbuttontext, type_mc) VALUES\
        (\
        " + connection.escape(scene.ID) + ",\
        IFNULL(" + connection.escape(scene.title_mc) + ",title_mc),\
        IFNULL(" + connection.escape(scene.size_mc) + ",size_mc),\
        IFNULL(" + connection.escape(scene.text_mc) + ",text_mc),\
        IFNULL(" + connection.escape(scene.answer_text_1) + ",answer_text_1),\
        IFNULL(" + connection.escape(scene.answer_text_2) + ",answer_text_2),\
        IFNULL(" + connection.escape(scene.answer_text_3) + ",answer_text_3),\
        IFNULL(" + connection.escape(scene.answer_text_4) + ",answer_text_4),\
        IFNULL(" + connection.escape(scene.answer_text_5) + ",answer_text_5),\
        IFNULL(" + connection.escape(scene.answer_text_6) + ",answer_text_6),\
        IFNULL(" + connection.escape(scene.sendbuttontext) + ",sendbuttontext),\
        IFNULL(" + connection.escape(scene.type_mc) + ",type_mc)\
        )\
        ON DUPLICATE KEY UPDATE \
        title_mc=IFNULL(" + connection.escape(scene.title_mc) + ",title_mc),\
        size_mc=IFNULL(" + connection.escape(scene.size_mc) + ",size_mc),\
        text_mc=IFNULL(" + connection.escape(scene.text_mc) + ",text_mc),\
        answer_text_1=IFNULL(" + connection.escape(scene.answer_text_1) + ",answer_text_1),\
        answer_text_2=IFNULL(" + connection.escape(scene.answer_text_2) + ",answer_text_2),\
        answer_text_3=IFNULL(" + connection.escape(scene.answer_text_3) + ",answer_text_3),\
        answer_text_4=IFNULL(" + connection.escape(scene.answer_text_4) + ",answer_text_4),\
        answer_text_5=IFNULL(" + connection.escape(scene.answer_text_5) + ",answer_text_5),\
        answer_text_6=IFNULL(" + connection.escape(scene.answer_text_6) + ",answer_text_6),\
        sendbuttontext=IFNULL(" + connection.escape(scene.sendbuttontext) + ",sendbuttontext),\
        type_mc=IFNULL(" + connection.escape(scene.type_mc) + ",type_mc)\
        ;";
    } else if (scene.type == 2) {
      // slider
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_slider\
        (global_scene_id, title_slider, text_top_slider, text_bot_slider, border_text_left_slider, border_text_right_slider,\
          avg_text_slider, vertical, startvalue) VALUES\
        (\
        " + connection.escape(scene.ID) + ",\
        " + connection.escape(scene.title_slider) + ",\
        " + connection.escape(scene.text_top_slider) + ",\
        " + connection.escape(scene.text_bot_slider) + ",\
        " + connection.escape(scene.border_text_left_slider) + ",\
        " + connection.escape(scene.border_text_right_slider) + ",\
        " + connection.escape(scene.avg_text_slider) + ",\
        " + connection.escape(scene.vertical) + ",\
        " + connection.escape(scene.startvalue) + "\
        )\
        ON DUPLICATE KEY UPDATE \
        title_slider=" + connection.escape(scene.title_slider) + ",\
        text_top_slider=" + connection.escape(scene.text_top_slider) + ",\
        text_bot_slider=" + connection.escape(scene.text_bot_slider) + ",\
        border_text_left_slider=" + connection.escape(scene.border_text_left_slider) + ",\
        border_text_right_slider=" + connection.escape(scene.border_text_right_slider) + ",\
        avg_text_slider=" + connection.escape(scene.avg_text_slider) + ",\
        vertical=" + connection.escape(scene.vertical) + ",\
        startvalue=" + connection.escape(scene.startvalue) + "\
        ;";
    } else if (scene.type == 3) {
      // pusher
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_pusher\
        (global_scene_id, title_pusher, text_pusher, icon_1_pusher, icon_2_pusher, icon_3_pusher,\
          icon_4_pusher, avg_text_pusher, size_pusher) VALUES\
        (\
        " + connection.escape(scene.ID) + ",\
        IFNULL(" + connection.escape(scene.title_pusher) + ", title_pusher),\
        IFNULL(" + connection.escape(scene.text_pusher) + ", text_pusher),\
        IFNULL(" + connection.escape(scene.icon_1_pusher) + ", icon_1_pusher),\
        IFNULL(" + connection.escape(scene.icon_2_pusher) + ", icon_2_pusher),\
        IFNULL(" + connection.escape(scene.icon_3_pusher) + ", icon_3_pusher),\
        IFNULL(" + connection.escape(scene.icon_4_pusher) + ", icon_4_pusher),\
        IFNULL(" + connection.escape(scene.avg_text_pusher) + ", avg_text_pusher),\
        IFNULL(" + connection.escape(scene.size_pusher) + ", size_pusher)\
        )\
        ON DUPLICATE KEY UPDATE \
        title_pusher=IFNULL(" + connection.escape(scene.title_pusher) + ", title_pusher),\
        text_pusher=IFNULL(" + connection.escape(scene.text_pusher) + ", text_pusher),\
        icon_1_pusher=IFNULL(" + connection.escape(scene.icon_1_pusher) + ", icon_1_pusher),\
        icon_2_pusher=IFNULL(" + connection.escape(scene.icon_2_pusher) + ", icon_2_pusher),\
        icon_3_pusher=IFNULL(" + connection.escape(scene.icon_3_pusher) + ", icon_3_pusher),\
        icon_4_pusher=IFNULL(" + connection.escape(scene.icon_4_pusher) + ", icon_4_pusher),\
        avg_text_pusher=IFNULL(" + connection.escape(scene.avg_text_pusher) + ", avg_text_pusher),\
        size_pusher=IFNULL(" + connection.escape(scene.size_pusher) + ", size_pusher)\
        ;";
    } else if (scene.type == 4) {
      // painter
      // pusher
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_painter\
              (global_scene_id, title_painter, text_painter, button_text_painter) VALUES\
              (\
              " + connection.escape(scene.ID) + ",\
              IFNULL(" + connection.escape(scene.title_painter) + ", title_painter),\
              IFNULL(" + connection.escape(scene.text_painter) + ", text_painter),\
              IFNULL(" + connection.escape(scene.button_text_painter) + ", button_text_painter)\
              )\
              ON DUPLICATE KEY UPDATE \
              title_painter=IFNULL(" + connection.escape(scene.title_painter) + ", title_painter),\
              text_painter=IFNULL(" + connection.escape(scene.text_painter) + ", text_painter),\
              button_text_painter=IFNULL(" + connection.escape(scene.button_text_painter) + ", button_text_painter)\
              ;";

    } else if (scene.type == 5) {
      // VOICER
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_voicer\
              (global_scene_id, title_voicer, text_voicer) VALUES\
              (\
              " + connection.escape(scene.ID) + ",\
              IFNULL(" + connection.escape(scene.title_voicer) + ", title_voicer),\
              IFNULL(" + connection.escape(scene.text_voicer) + ", text_voicer)\
              )\
              ON DUPLICATE KEY UPDATE \
              title_voicer=IFNULL(" + connection.escape(scene.title_voicer) + ", title_voicer),\
              text_voicer=IFNULL(" + connection.escape(scene.text_voicer) + ", text_voicer)\
              ;";
    }

    else if (scene.type == 6) {
      // TEXTER
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_texter\
              (global_scene_id, title_texter, big_texter) VALUES\
              (\
              " + connection.escape(scene.ID) + ",\
              IFNULL(" + connection.escape(scene.title_texter) + ", title_texter),\
              IFNULL(" + connection.escape(scene.big_texter) + ", big_texter)\
              )\
              ON DUPLICATE KEY UPDATE \
              title_texter=IFNULL(" + connection.escape(scene.title_texter) + ", title_texter),\
              big_texter=IFNULL(" + connection.escape(scene.big_texter) + ", big_texter)\
              ;";
    }

    else if (scene.type == 7) {
      // IMAGER UP
      customsql = "INSERT INTO " + dbConfig.DB + ".scene_content_imageup\
              (global_scene_id, title_imageup, text_imageup) VALUES\
              (\
              " + connection.escape(scene.ID) + ",\
              IFNULL(" + connection.escape(scene.title_imageup) + ", title_imageup),\
              )\
              ON DUPLICATE KEY UPDATE \
              title_imageup=IFNULL(" + connection.escape(scene.title_imageup) + ", title_imageup)\
              ;";
    }
    else {
      logger.warn("DB - scene - update", "forbidden type: " + scene.type)
      return
    }

    let sql = 'UPDATE ' + dbConfig.DB + '.scene\
                SET \
                scene.name=IFNULL(' + connection.escape(scene.name) + ', scene.name),\
                scene.order=IFNULL(' + connection.escape(scene.order) + ', scene.order),\
                live=IFNULL(' + connection.escape(scene.live) + ', live), \
                reuse=IFNULL(' + connection.escape(scene.reuse) + ', reuse), \
                show_eval=IFNULL(' + connection.escape(scene.show_eval) + ', show_eval), \
                disabled=IFNULL(' + connection.escape(scene.disabled) + ', disabled), \
                cooldown=IFNULL(' + connection.escape(scene.cooldown) + ', cooldown), \
                countdown=IFNULL(' + connection.escape(scene.countdown) + ', countdown), \
                countdownstart=IFNULL(' + connection.escape(scene.countdownstart) + ', countdownstart), \
                scene.type=IFNULL(' + connection.escape(scene.type) + ', scene.type),\
                scene.customStageNumber=IFNULL(' + connection.escape(scene.customStageNumber) + ', scene.customStageNumber),\
                scene.moderate=IFNULL(' + connection.escape(scene.moderate) + ', scene.moderate)\
                WHERE scene.ID=' + connection.escape(scene.ID) + ' AND scene.show=' + connection.escape(scene.show.replace("'", "")) + ';';
    logger.debug("DB - scene - update", sql);
    return connection.query(
      sql + customsql,
      function (err, rows) {
        if (err) {
          logger.error("DB - scene -  update", err);
        }
        callback(err, rows[1]);
      }
    );
  },


  /**
   * mySql.Connection} connection sql interace object 
   * @param {Struct} dbConfig db configuration, usedf to enter right table
   * @param {Logger} logger logger object to acces logging
   * @param {String} link identifier for show
   * @param {String} token acces token for logged in user to manipulate show
   * @param {Function} callback 
   * @unsafe since sql injection are not protected
   * @returns 
   */
  get_all: function (connection, dbConfig, logger, link, token, callback) {
    // TODO: defend from sql injection... UNSAGE

    const joints = "  LEFT JOIN " + dbConfig.DB + ".scene_content_mc\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_mc.global_scene_id\
                  LEFT JOIN " + dbConfig.DB + ".scene_content_pusher\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_pusher.global_scene_id\
                  LEFT JOIN " + dbConfig.DB + ".scene_content_slider\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_slider.global_scene_id\
                  LEFT JOIN " + dbConfig.DB + ".scene_content_painter\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_painter.global_scene_id\
                  LEFT JOIN " + dbConfig.DB + ".scene_content_noop\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_noop.global_scene_id\
                  LEFT JOIN " + dbConfig.DB + ".scene_content_voicer\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_voicer.global_scene_id\
                  LEFT JOIN " + dbConfig.DB + ".scene_content_texter\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_texter.global_scene_id\
                  LEFT JOIN " + dbConfig.DB + ".scene_content_imageup\
                  ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_imageup.global_scene_id\
                  "

    var sql = 'SELECT * FROM ' + dbConfig.DB + '.scene\
        ' + joints + '\
        WHERE scene.show="' + link + '" AND owner=(SELECT ID from ' + dbConfig.DB + '.user WHERE ID=(SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue="' + token + '")) ORDER BY scene.order ;';
        logger.debug("DB - scene - get_all", sql);

    return connection.query(
      sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - scene - get_all", err);
        }
        callback(err, rows);
      }
    );
  },



  get_by_link_and_id: function (connection, dbConfig, logger, link, id, callback) {
    const joints = "  LEFT JOIN " + dbConfig.DB + ".scene_content_mc\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_mc.global_scene_id\
    LEFT JOIN " + dbConfig.DB + ".scene_content_pusher\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_pusher.global_scene_id\
    LEFT JOIN " + dbConfig.DB + ".scene_content_slider\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_slider.global_scene_id\
    LEFT JOIN " + dbConfig.DB + ".scene_content_painter\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_painter.global_scene_id\
    LEFT JOIN " + dbConfig.DB + ".scene_content_noop\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_noop.global_scene_id\
    LEFT JOIN " + dbConfig.DB + ".scene_content_voicer\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_voicer.global_scene_id\
    LEFT JOIN " + dbConfig.DB + ".scene_content_texter\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_texter.global_scene_id\
    LEFT JOIN " + dbConfig.DB + ".scene_content_imageup\
    ON " + dbConfig.DB + ".scene.ID = " + dbConfig.DB + ".scene_content_imageup.global_scene_id\
    "

    var sql = 'SELECT * FROM ' + dbConfig.DB + '.scene\
                ' + joints + '\
                WHERE scene.show="' + link + '" AND ' + dbConfig.DB + '.scene.ID=' + id + ';';
    logger.debug("DB - scene - get_by_link_and_id", sql);


  
    return connection.query(
      sql,
      function (err, rows) {
        if (err || rows === undefined) {
          logger.error("DB - SCENE - get_by_link_and_id", err);
        }
        callback(err, rows);
      }
    );
  },



  delete: function (connection, dbConfig, logger, idscene, link, token, callback) {
    // delete old token in database after user login in
    var sql = 'DELETE FROM ' + dbConfig.DB + '.scene WHERE scene.ID=' + idscene + ' AND scene.show="' + link + '" AND owner=(SELECT ID from ' + dbConfig.DB + '.user WHERE ID=(SELECT owner FROM ' + dbConfig.DB + '.tokens where tokenvalue="' + token + '")) ORDER BY scene.order ;';
    logger.debug("DB - scene - DELETE", sql);
    connection.query(sql,
      function (err, rows) {
        if (err) {
          logger.error("DB - SCENE - DELETE", err)
        }
        callback(err, rows);
      });


  }
}
