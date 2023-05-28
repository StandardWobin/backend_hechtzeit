import express from "express";
import cors from "cors";
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import fs from "fs";
import path from "path";
import https from "https";

// what is that used for?
import passport from 'passport';

// actual request
import secureRequests from "./routes/https/secureAdmin.js";
import unSecureRequests from "./routes/https/unSecure.js";

export class HttpsRequestHandler {
  #HttpsServerport;
  #APIServerPort;

  constructor(HttpsServerPort, APIServerPort, logger, DBC) {
    this.#HttpsServerport = HttpsServerPort;
    this.#APIServerPort = APIServerPort;

    // express as request middleware
    let app = express();
    let apiApp = express();

    // set up cors
    app.use(cors({
      origin: 'https://DOMAIN.com'
    }));

    apiApp.use(cors({
      origin: 'https://DOMAIN.com'
      
    }));
    
    // use jsons
    app.use(express.json());

    // serve a public folder with name 'public'
    app.use(express.static('public'));

    // dont know if we need this?
    app.use(bodyParser.json())

    // validation cookies
    app.use(cookieSession({
      name: 'mysession',
      keys: ['vueauthrandomkey'],
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/api/", secureRequests(logger, DBC));
    app.use("/api/", unSecureRequests(logger, DBC));

    let ssl = {
      key: fs.readFileSync(path.join("hidden", "certificates", "key.pem")),
      cert: fs.readFileSync(path.join("hidden", "certificates", "cert.pem")),
    };

    this.sslServer = https.createServer(ssl, app);
    this.apiServer = https.createServer(ssl, apiApp);
  }

  start() {
    this.sslServer.listen(this.#HttpsServerport);
    this.apiServer.listen(this.#APIServerPort);
    return { sslServer: this.sslServer, apiServer: this.apiServer }
  }
}

