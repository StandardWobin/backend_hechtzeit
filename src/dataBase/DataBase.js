import mysql from 'mysql';
import * as scene from './db_operations/scene.cjs';
import * as show from './db_operations/show.cjs';
import * as security from './db_operations/security.cjs';
import * as feedback from './db_operations/feedback.cjs';


export class DataBaseConnector {
  #dbConfig;
  constructor(dbConfig, logger) {
    this.#dbConfig = dbConfig;

    this.connection = mysql.createConnection({
      host: this.#dbConfig.HOST,
      user: this.#dbConfig.USER,
      port: this.#dbConfig.PORT,
      password: this.#dbConfig.PASSWORD,
      database: this.#dbConfig.DB,
      multipleStatements: true,
    });

    this.connection.connect();
    this.logger = logger;
    this.logger.info("DB", "data base set up host:" + this.#dbConfig.HOST + " user:" + this.#dbConfig.USER + " port:" + this.#dbConfig.PORT + " db:" + this.#dbConfig.DB)

  }

  // secutiry 

  security__validate_token(token, callback) {
    security.default.validate_token(this.connection, this.logger, token, callback)
  }
  security__get_user_by_email(email, callback) {
    security.default.get_user_by_email(this.connection, this.logger, email, callback)
  }
  
  security__insert_token(email, token) {
    security.default.insert_token(this.connection, this.logger, email, token)
  }



  // show // //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  
  show__get_all_links_if_active(callback) {
    show.default.get_all_links_if_active(this.connection, this.#dbConfig, this.logger, callback);
  }

  show__get_all_links_if_offline(callback) {
    show.default.get_offline_shows(this.connection, this.#dbConfig, this.logger, callback);
  }


  


    // show // //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  
  show__get_all_links(callback) {
    show.default.get_all_links(this.connection, this.#dbConfig, this.logger, callback);
  }
  show__get_active_scenes(link, callback) {
    show.default.get_active_scenes(this.connection, this.#dbConfig, this.logger, link, callback)
  }
  show__get_by_token(token, order, callback) {
    show.default.get_by_token(this.connection, this.#dbConfig, this.logger, token, order, callback)
  }

  show__get_by_link_for_non_admin(link, order, callback) {
    show.default.get_by_link_for_non_admin(this.connection, this.#dbConfig, this.logger, link, order, callback)
  }

  show__get(link, token, order, callback) {
    show.default.get(this.connection, this.#dbConfig, this.logger, link, token, order, callback)
  }

  show__check_if_online(link, callback) {
    show.default.check_if_online(this.connection, this.#dbConfig, this.logger, link, callback);
  }

  show__update(data, callback) {
    show.default.update(this.connection, this.#dbConfig, this.logger, data, callback);
  }

  show__delete(link, token, callback) {
    show.default.delete(this.connection, this.#dbConfig, this.logger, link, token, callback);
  }

  show__insert_new(name, link, token, callback) {
    show.default.insert_new(this.connection, this.#dbConfig, this.logger, name, link, token, scene.default.insert_new, callback);
  }
  
  show__set(link, index, callback) {
    show.default.set(this.connection, this.#dbConfig, this.logger, link, index, callback)
  }

  show__setApi(link, index, callback) {
    show.default.setApi(this.connection, this.#dbConfig, this.logger, link, index, callback)
  }





  // scene // //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  
  scene__get_all(link, token, callback) {
    scene.default.get_all(this.connection, this.#dbConfig, this.logger, link, token, callback);
  }
  
  scene__get_by_link_and_id(link, id, callback) {
    scene.default.get_by_link_and_id(this.connection, this.#dbConfig, this.logger, link, id, callback)
  }

  scene__insert_new(data, callback) {
    scene.default.insert_new(this.connection, this.#dbConfig, this.logger, data, callback)
  }

  scene__update(data, callback) {
    scene.default.update(this.connection, this.#dbConfig, this.logger, data, callback)
  }

  scene___delete(id, link, token, callback) {
    scene.default.delete(this.connection, this.#dbConfig, this.logger, id, link, token, callback)

  }

  // feedback stuff
  feedback___accept(link, sceneId, feedbackId, callback) {
    feedback.default.accept(this.connection, this.#dbConfig, this.logger, link, sceneId, feedbackId, callback)
  }

  feedback___handle(message, callback) {
    feedback.default.handle(this.connection, this.#dbConfig, this.logger, message, callback)
  }

  feedback___compile(link, ID, type, callback) {
    feedback.default.compile(this.connection, this.#dbConfig, this.logger, link, ID, type, callback)
  }

  feedback___reset(token, ID, callback) {
    feedback.default.reset(this.connection, this.#dbConfig, this.logger, token, ID, callback)
  }
}

