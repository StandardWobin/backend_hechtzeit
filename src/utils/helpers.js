import fs from "fs";



export function dbConfigCheck(shows) {
  if (!fs.existsSync("./hidden/")) {
    throw Error("public folder does not exist");
  }
  if (!fs.existsSync("./hidden/db")) {
    throw Error("'hidden/db' folder not found");
  }
  if (!fs.existsSync("./hidden/db/db.config.js")) {
    throw Error("db config file not found: is  '/hidden/db/db.config.js' there?");
  }

  if (!fs.existsSync("./hidden/certificates")) {
    throw Error("certificate folder not found");
  }

  if (!fs.existsSync("./hidden/certificates/cert.pem")) {
    throw Error("certificate file not found - is 'cert.pem' there?");
  }

  if (!fs.existsSync("./hidden/certificates/key.pem")) {
    throw Error("certificate file not found - is 'key.pem' there?");
  }

}



export function fileSysCheck(shows, logger) {
  if (!fs.existsSync("./public/")) {
    throw Error("public folder does not exist");
  }
  if (!fs.existsSync("./public/default.png")) {
    throw Error("default.png does not exist");
  }
  if (!fs.existsSync("./public/logo.png")) {
    throw Error("logo.png does not exist");
  }

  // test if data container is there (cause its not in repository) - if not -> try to create it
  if (!fs.existsSync("./data")) {
    logger.warn("fileSysCheck", "data folder missing and will be created");
    try {
      fs.mkdirSync("./data");
    } catch {
      logger.error("fileSysCheck", "data folder is missing and could not be created");
      throw Error("data folder is missing and could not be createt");
    }
  }

  // validate that every show in DB has its data container
  shows.forEach(show => {
    if (!fs.existsSync("./public/" + show.link)) {
      logger.warn("fileSysCheck", "public folder for show " + show.link + " is missing");
      try {
        fs.mkdirSync("./public/" + show.link);
      } catch {
        logger.error("fileSysCheck", "public folder for show " + show.link + " is missing and could not be created");
        throw Error("fileSysCheck", "public folder for show " + show.link + " is missing and could not be created");
      }
    }




    if (!fs.existsSync("./public/" + show.link + "/default.png")) {
      logger.warn("public default png for show " + show.link + " is missing");
      try {
        fs.copyFileSync('./public/default.png', './public/' + show.link + '/default.png');
      } catch {
        logger.error("fileSysCheck", "public default png for show " + show.link + " is missing and could not be copied");
        throw Error("public default png for show " + show.link + " is missing and could not be copied");
      }
    }




    if (!fs.existsSync("./public/" + show.link + "/logo.png")) {
      logger.warn("public default png for show " + show.link + " is missing");
      try {
        fs.copyFileSync('./public/logo.png', './public/' + show.link + '/logo.png');
      } catch {
        logger.error("fileSysCheck", "public logo png for show " + show.link + " is missing and could not be copied");
        throw Error("public logo png for show " + show.link + " is missing and could not be copied");
      }
    }




    if (!fs.existsSync("./data/" + show.link)) {
      logger.warn("fileSysCheck", "data folder for show " + show.link + " is missing");
      try {
        fs.mkdirSync("./data/" + show.link);
      } catch {
        logger.error("fileSysCheck", "data folder for show " + show.link + " is missing and could not be created");
        throw Error("data folder for show " + show.link + " is missing and could not be created");
      }
    }




    if (!fs.existsSync("./data/" + show.link + "/audio")) {
      logger.warn("fileSysCheck", "audio data folder for show " + show.link + " is missing");
      try {
        fs.mkdirSync("./data/" + show.link + "/audio");
      } catch {
        logger.error("fileSysCheck", "audio data folder for show " + show.link + " is missing and could not be created");
        throw Error("audio data folder for show " + show.link + " is missing and could not be created");
      }
    }



    if (!fs.existsSync("./data/" + show.link + "/images")) {
      logger.warn("fileSysCheck", "images data folder for show " + show.link + " is missing");
      try {
        fs.mkdirSync("./data/" + show.link + "/images");
      } catch {
        logger.error("fileSysCheck", "images data folder for show " + show.link + " is missing and could not be created");
        throw Error("images data folder for show " + show.link + " is missing and could not be created");
      }
    }




  })
}


export function envCheck() {
  let dev = undefined
  if (process.argv[2] === undefined) {
    throw Error('Unsupported Server start! - please launch via "npm run dev" or "npm run build"')
  } else {
    if (process.argv[2] !== "dev" && process.argv[2] !== "production") {
      throw Error('Unsupported Server start!');
    } else {
      process.argv[2] === "dev" ? dev = true : dev = false;
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - ")
      dev ? console.log("- - - - - - - - - DEVELOPMENT MODE - - - - - - - -  ") : console.log("- - - - - - - - -  PRODUCTION MODE - - - - - - - - ");
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - ");
    }
  }
  return dev;
}


export function stringify(object) {
  let res = "";
  if (Array.isArray(object)) {
    res = res + "[";
    object.forEach(o => {
      res = res + stringify(o) + ", ";
    })
    res = res + "]";
  } else if (typeof object === 'object' && object !== null && !(object instanceof Array) && !(object instanceof Date)) {
    res = res + "{";
    for (const [key, value] of Object.entries(object)) {
      res = res + key + ": " + stringify(value) + ", ";
    }
    res = res + "}";
  } else {
    res = res + object;
  }
  res = res.replace(", ]", "]")

  res = res.replace(", }", "}")
  return res;
}
// Helper function TODO: exclude from script
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function strcmp(a, b) {
  // little helper which return true if two strings are equal
  if (typeof (a) === "string" && typeof (b) === "string") {
    if (a.toString() < b.toString()) return false;
    if (a.toString() > b.toString()) return false;
    return true;
  } else {
    throw new Error("a and b must be Strings");
  }

}

export function resultHandler(scene, rowData) {
  let result = undefined;
  if (scene.type == 0) {
    // noop send eval... to contorl webstage
    result = [];
  }
  else if (scene.type == 1) {

    if (scene.size_mc === undefined) {
      throw new Error("Scene has no MC size");
    }
    if (typeof (scene.size_mc) !== "number") {
      throw new Error("Scene mc size is not a number");
    }

    if (rowData === undefined) {
      throw new Error("For Scenes type 1, there is row data to be defined");
    }

    if (!Array.isArray(rowData)) {
      throw new Error("For Scenes type 1, row data has to be an array");
    }
    result = new Array(scene.size_mc).fill(0);
    rowData.forEach(r => {
      result[parseInt(r.message) - 1] += 1;
    })
  } else if (scene.type == 2) {
    // slider
    let counter = 0;
    result = 50;

    if (rowData.length == 0) {
      result = 50;
    } else {
      rowData.forEach(r => {
        counter += 1;
        console.log(r, result)
        result += parseInt(r.message);
      })
      result = result / counter
    }
  }
  else if (scene.type == 3) {
    // PUSHER
    let keys = Object.keys(rowData[0]);

    result = new Array(keys.length).fill(0)
    let index = 0;

    result.forEach(r => {
      result[index] = rowData[0][keys[index]];
      index = index + 1;
    })
  }
  else if (scene.type == 4) {
    // painter
    result = [];
  }
  else if (scene.type == 5) {
    // 
    result = [];
  }
  else if (scene.type == 6) {
    // 
    result = [];
  }
  else if (scene.type == 7) {
    // 
    result = [];
  }
  return result;

}


