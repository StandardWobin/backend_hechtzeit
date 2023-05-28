
import { Server } from "socket.io";
import { assert } from "console";


export class APISockets {
    constructor(logger, httpsServer, socketOptions, dev) {
        this.logger = logger;
        this.ioapi = new Server(httpsServer, socketOptions);
        this.dev = dev;
    }


    debug(show) {
        let so = this.getSocketAmount(show)
        let d = "webstages: " + so.webstages + " previews:" + so.previews + " others:" + so.others;
        console.log("APISOCKETS  " + d)
        this.logger.info("APISOCKETS", d);
    }
    disconnectAllSockets(show) {
        let sockets = this.ioapi.sockets.sockets;
        sockets.forEach(socket => {
            if (socket.link !== undefined) {


                if (socket.link.toLowerCase() == show.toLowerCase()) {
                    socket.disconnect()
                }
            }
        })
    }
    getSocketAmount(show) {
        let sockets = this.ioapi.sockets.sockets;

        let webstages = 0;
        let others = 0;
        let previews = 0;

        sockets.forEach(socket => {
            if (socket.link !== undefined) {

                if (socket.link == show) {
                    if (socket.usecase === "webstage") {
                        webstages++;
                    } else if (socket.usecase === "preview") {
                        previews++;
                    } else {
                        others++;
                    }
                }
            }
        })
        return { webstages: webstages, others: others, previews: previews }
    }

    sendAutoEval(link, message) {
        this.getSocketAmount(link);
        // this.getSocketStatus(link);
        assert(link != "");
        assert(link !== undefined);
        assert(link !== null);

        if (message === undefined) {
            this.logger.error("APISOCKET - senautoeval - message is undefined")

            if (this.dev) {
                throw Error("message is undefined")
            } else {
                return
            }
        }

        if (message.result === undefined) {
            console.log(message)
            return;
        }

        let sockets = this.ioapi.sockets.sockets;
        this.logger.trace("SERVER-AUTO", "udpate show evals for API show: " + link);
        console.log(link, message)
        sockets.forEach((socket, index) => {
            if (socket.link !== undefined && socket.link !== null) {
                if (socket.link.toLowerCase() == link.toLowerCase()) {
                    socket.emit("eval_from_server_for_api", message);
                }
            } else {
                console.log(socket.link, " + ", link + " ERROR");
            }
        });
    }

    sendInstandMessage(link, customStageNumber, type, username, message) {
        if (link === undefined) {
            return;
        }

        console.log("link", link)
        console.log("customStageNumber", customStageNumber)
        console.log("type", type)
        console.log("username", username)
        console.log("typeof(message)", typeof (message))
        console.log("link", link)

        var sockets = this.ioapi.sockets.sockets;
        sockets.forEach(socket => {
            if (socket.link !== undefined) {
                if (socket.link.toLowerCase() == link.toLowerCase()) {
                    socket.emit("call", [type, customStageNumber, username, message]);
                }
            }
        });
    }

    setAPIScene(link, sceneIx) {
        assert(link != "");
        assert(link !== undefined);
        assert(link !== null);
        let sockets = this.ioapi.sockets.sockets;
        this.logger.trace("UPDATE SCENE IX", "udpate IXAPI  for show: " + link + " for scene: " + sceneIx);

        sockets.forEach((socket, index) => {
            if (socket.link !== undefined && socket.link !== null) {
                if (socket.link.toLowerCase() == link.toLowerCase()) {
                    socket.emit("set_scene", sceneIx);
                }
            } else {
                console.log(socket.link, " + ", link + " ERROR " + namespace);
            }
        });
    }

    start() {
        this.ioapi.on("connection", (socket) => {
            this.dev ? console.log("new api socket connected") : () => { };
            this.logger.debug("APISOCKET - SOCKET", "new api socket connected");
            socket.on("link", (link) => {
                socket.link = link;
            })
            socket.on("usecase", (usecase) => {
                socket.usecase = usecase;
            })
        }
        );
        this.logger.info("API SOKCET", "STARTED")
    }
}