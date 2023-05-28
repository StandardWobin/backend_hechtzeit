
import {Server} from "./src/Server.js";

let HttpsPort = 1337;
let ApiSocketPort = 2000;
let logLevel = 0; // 0 trace, ..., 5 Fatal
let consoleLogLevel = 6;  // 0 trace, ..., 5 Fata | 6 to deactive

let iteration = 2000;
let server = new Server(HttpsPort, ApiSocketPort, logLevel, consoleLogLevel, iteration) 
server.start();
