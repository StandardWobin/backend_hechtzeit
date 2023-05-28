
import { Logger } from "./utils/Logger.js";
import { envCheck, fileSysCheck, dbConfigCheck } from "./utils/helpers.js";
import { DataBaseConnector } from "./dataBase/DataBase.js";
import { HttpsRequestHandler } from "./https/HttpsRequestHandler.js";
import { APISockets } from "./https/routes/sockets/APISockets.js";
import { HumanSockets } from "./https/routes/sockets/HumanSockets.js";
import { SimpleFilter } from "./filter/SimpleFilter.js";

// managers
import { FlyingDutchman } from "./Managers/FlyingDutchman.js";
import { StateManager } from "./Managers/StateManager.js";
import dbConfig from "../hidden/db/db.config.js";


export class Server {
    #ApiSocketPort;
    constructor(HttpsPort, ApiSocketPort, logLevel, consoleLogLevel, iteration) {
        this.#ApiSocketPort = ApiSocketPort;

        // set up logger
        this.logger = new Logger(logLevel, consoleLogLevel, "server.log");
        this.logger.cls();

        // check the envoirnemtnet
        this.dev = envCheck();

        // set up databse
        this.dataBaseConnector = new DataBaseConnector(dbConfig, this.logger);

        // file system checkUp;
        this.dataBaseConnector.show__get_all_links((_, shows) => { fileSysCheck(shows, this.logger) })

        this.httpsRequestHandler = new HttpsRequestHandler(HttpsPort, ApiSocketPort, this.logger, this.dataBaseConnector);
        let servers = this.httpsRequestHandler.start();

        const socketOptions = {
            origins: ["*"],
            cors: true,
            methods: ["GET", "POST"],
            transport: ['websocket'],
            allowEIO3: true
        };

        this.flyinDutchman = new FlyingDutchman(this.logger, this.dataBaseConnector);
        this.simpleFilter = new SimpleFilter(this.logger, ["de", "en"]);

        this.apiSockets = new APISockets(this.logger, servers.apiServer, socketOptions, this.dev);
        let humanSockets = new HumanSockets(this.logger, servers.sslServer, socketOptions, this.dataBaseConnector, this.flyinDutchman, this.apiSockets, this.simpleFilter, this.dev);

        this.apiSockets.start();
        humanSockets.start();

        let stateManager = new StateManager(this.flyinDutchman, humanSockets, this.apiSockets, iteration);
        stateManager.start()
    }

    start() {
        console.log("start");
    }

}