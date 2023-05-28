import { resultHandler } from "../utils/helpers.js";
export class FlyingDutchman {
  constructor(logger, dataBaseConnector) {
    this.logger = logger;

    this.db = dataBaseConnector;
    this.activeShows = [];

    this.flying_USER_results = {};
    this.flying_API_results = {};
    this.flying_USER_scenes = {};
    logger.info("FLYING DUTCHMAN", "AHOI")

  }

  get_flying_API_result(show) {
    let scene = this.flying_API_results[show.toLowerCase()]
    this.logger.trace("FLYING DUTCHMAN - get_flying_API_result:", show + " res:" + scene)
    return scene

  }

  get_flying_USER_result(show) {
    let scene = this.flying_USER_results[show.toLowerCase()]
    this.logger.trace("FLYING DUTCHMAN - get_flying_USER_result:", show + " res:" + scene)
    return scene

  }

  get_flying_USER_scene(show) {
    let scene = this.flying_USER_scenes[show.toLowerCase()];
    this.logger.trace("FLYING DUTCHMAN - get_flying_USER_scene:", show + " res:" + scene)
    return scene
  }

  // array of strings
  get_online_shows(callback) {
    this.db.show__get_all_links_if_active((err, result) => {
      // why this was result.length == 1 anyways? 
      if (result.length >= 1 && result !== undefined) {
        let temp = [];
        result.forEach(r => {
          temp.push(r.link);
        })
        this.logger.trace("FLYING DUTCHMAN - get_online_shows - result:", temp)
        this.shows = temp;
        callback(temp);
      }
      else {
        this.activeShows = [];
        callback([]);
      }
    });
  }


  // array of strings
  get_offline_shows(callback) {
    this.db.show__get_all_links_if_offline((err, result) => {
      if (result.length >= 1 && result !== undefined) {
        let temp = [];
        result.forEach(r => {
          temp.push(r.link);
        })
        this.logger.trace("FLYING DUTCHMAN - get_online_shows - result:", temp)
        this.shows = temp;
        callback(temp);
      }
      else {
        this.activeShows = [];
        callback([]);

      }
    });
  }

  debug(show) {
    // DEBUG 
    console.log("   USER scene    :", this.flying_USER_scenes[show.toLowerCase()].ID)
    console.log("   USER feedback :", this.flying_USER_results[show.toLowerCase()])
    console.log("   API  feedback :", this.flying_API_results[show.toLowerCase()])
    this.logger.debug("FLYING DUTCH AUTO", "  USER scene       :" + this.flying_USER_scenes[show.toLowerCase()].ID)
    this.logger.debug("FLYING DUTCH AUTO", "  USER feedback    :" + this.flying_USER_results[show.toLowerCase()])
    this.logger.debug("FLYING DUTCH AUTO", "  API  feedback    :" + this.flying_API_results[show.toLowerCase()])
  }

  update_flys(link, callback) {
    this.logger.trace("SERVER", "update the flying all scenes for show: " + link);
    if (link === undefined) {
      this.logger.warn("SERVER - update_flys", "that should not happen (link undefined)");
    }
    if (callback === undefined) {
      this.logger.warn("SERVER - update_flys", "that should not happen (callback undefined)");
    }
    if (this.flying_USER_scenes[link] === undefined || this.flying_USER_scenes === undefined) {
      this.flying_USER_scenes[link] = {};
    }

    if (this.flying_USER_results[link] === undefined || this.flying_USER_results === undefined) {
      this.flying_USER_results[link] = {};
    }

    if (this.flying_API_results[link] === undefined || this.flying_API_results === undefined) {
      this.flying_API_results[link] = {};
    }

    let finishedRequests = 0;
    this.db.show__get_active_scenes(link, (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        if (rows.length == 0) {
          return
        }
        // DEBUG
        let sceneAudienceID = rows[0].sceneAudience;
        let sceneAPIIndex = rows[0].sceneAPI;

        console.log("---------------------------------- ", link, " ------------------------------");
        this.logger.debug("FLYING DUTCH AUTO", "---------------------------------- ", link, " ------------------------------")
        console.log("USER scene ID:    ", sceneAudienceID, "          API scene ID: ", sceneAPIIndex);
        this.logger.debug("FLYING DUTCH AUTO", "USER scene ID:    ", sceneAudienceID, "          API scene ID: ", sceneAPIIndex)

        // get the actual scene with the API 
        this.db.scene__get_by_link_and_id(link, sceneAPIIndex, (err, rows) => {
          let scene = rows[0];

          if (scene === undefined) {
            this.logger.warn("FYLING DUTCHMAN - update_flys - scene__get_by_link_and_id", link + " " + sceneAPIIndex + "returned undefined");
            return
          }
          this.db.feedback___compile(link, scene.ID, scene.type, (rows) => {
            let result = { customStageNumber: scene.customStageNumber, type: scene.type, result: undefined };
            result.result = resultHandler(scene, rows);
            this.flying_API_results[link.toLowerCase()] = result;

            finishedRequests++
            if (finishedRequests == 2) {
              callback();
            }
          })
        })

        // FOR THE HORDE... eh USERs
        this.db.scene__get_by_link_and_id(link, sceneAudienceID, (err, rows) => {
          if (err) {
            console.log("there was a problem geting the scene... this is the error: ", err);
          } else {
            let scene = rows[0];
            if (scene === undefined) {
              return
            }
            // // // // // // // // // // //  
            // state of the scene for a show
            // ... active scene
            this.flying_USER_scenes[link.toLowerCase()] = scene;
            this.db.feedback___compile(link, scene.ID, scene.type, (rows) => {
              let result = { sceneID: scene.ID, type: scene.type, result: undefined };
              result.result = resultHandler(scene, rows);
              this.flying_USER_results[link.toLowerCase()] = result;
              finishedRequests++
              if (finishedRequests == 2) {
                callback()
              }
            })
          }
        })
      }
    })
  }


  /*
  TODO: here need to be implemented what is to send to the client
  at the moment everthring from a scene object is send what is not neccessarty
  */
  get_scene_frontend(link) {
    let scene = this.flying_USER_scenes[link];
    if (scene === undefined) {
      console.log("!!!!!!!!!!!!!!!!!!!!! UNDEFUNED PROTECTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      update_flys(link, () => {
        get_scene_frontend(link)
      });
      return;
    }
    return scene;
  }
}
