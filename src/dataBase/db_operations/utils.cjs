module.exports = {
  // helper function which iterates over all parameters and errors if there are empty or undefined
    checkparameters(logger) {
      for (var i = 1; i < arguments.length - 1; i++) {
        logger.trace("check arguments", arguments);
        if (arguments[i] === undefined || arguments[i] == "") {
          logger.error("DB", "illigal parameter in " + arguments.callee.caller.name);
          throw new Error("Illigal paramater in " + arguments.callee.caller.name);
        }
      }
      // call the last argument (supposed to be a function)
      arguments[arguments.length - 1]();
    }
}

