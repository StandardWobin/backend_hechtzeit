import log4js from "log4js";
import fs from "fs";



export class Logger {
  constructor(logLevel, consoleLogLevel, filename) {
    let level = undefined;
    this.filename = filename;
    this.consoleLogLevel = consoleLogLevel;

    if(logLevel == -1 ) {
      // dummy logic
      this.level = "dummy";
      return;
    }

    if(logLevel == 0) {
      this.level = "trace";
    } else if(logLevel == 1) {
      this.level = "debug";
    } else if(logLevel == 2) {
      this.level = "info";
    } else if(logLevel == 3) {
      this.level = "warn";
    } else if(logLevel == 4) {
      this.level = "error";
    } else if(logLevel == 5) {
      this.level = "fatal";
    } else {
      throw Error("log level: " + logLevel + " not supported")
    }
    log4js.configure({
      appenders: { server: { type: "file", filename: filename } },
      categories: { default: { appenders: ["server"], level: this.level } },
    });

    this.logger = log4js.getLogger("server");
  }

  cls(times = 3) {
    for(let i = 0; i < times; i ++) {
      this.logger.info("");
    }
    this.logger.info("         CLEAR            ");

    for(let i = 0; i < times; i ++) {
      this.logger.info("");
    }
  }

  trace(prefix, msg) {
    if(this.level !== "dummy") {
      this.logger.trace(prefix + " - " + msg);
      this.consoleLogLevel <= 0 ? this.cmdOut("trace", prefix, msg) : ()=>{};
    }
  }

  debug(prefix, msg) {
    if(this.level !== "dummy") {

    this.logger.debug(prefix + " - " + msg);
    this.consoleLogLevel <= 1 ? this.cmdOut("debug", prefix, msg) : ()=>{};
  }}

  info(prefix, msg) {
    if(this.level !== "dummy") {

    this.logger.info(prefix + " - " + msg);
    this.consoleLogLevel <= 2 ? this.cmdOut("info", prefix, msg) : ()=>{};
  }}

  warn(prefix, msg) {
    if(this.level !== "dummy") {

    this.logger.warn(prefix + " - " + msg);
    this.consoleLogLevel <= 3 ? this.cmdOut("warn", prefix, msg) : ()=>{};
  }}

  error(prefix, msg) {
    if(this.level !== "dummy") {

    this.logger.error(prefix + " - " + msg);
    this.consoleLogLevel <= 4 ? this.cmdOut("error", prefix, msg) : ()=>{};
  }}

  fatal(prefix, msg) {
    if(this.level !== "dummy") {

    this.logger.fatal(prefix + " - " + msg);
    this.consoleLogLevel <= 5 ? this.cmdOut("fatal", prefix, msg) : ()=>{};
  }}

  cmdOut(level, prefix, msg) {
    console.log("LOG|" + level + "|\t" + prefix + " - " + msg);
  }

}