
import { Server } from "socket.io";
import { assert } from "console";
import jwt from "jsonwebtoken";

export class HumanSockets {
    constructor(logger, httpsServer, socketOptions, dataBaseConnection, flyingDutchman, apiSockets, filter, dev) {
        this.logger = logger;
        this.io = new Server(httpsServer, socketOptions);

        this.adminNamespace = this.io.of("/admin");
        this.userNamespace = this.io.of("/user");

        this.db = dataBaseConnection;
        this.flyingDutchman = flyingDutchman;
        this.apiSockets = apiSockets;
        this.filter = filter;
        this.dev = dev;
    }



    debug(show) {
        let so = this.getSocketAmount(show)
        let d = "users: " + so.users + " admins:" + so.admins;
        console.log("USERSOCKET  " + d)
        this.logger.info("USERSOCKET", d);
    }


    disconnectAllUserSockets(show) {
        let sockets = this.io.of("/user").sockets;
        console.log("DISCONNECT")

        sockets.forEach(socket => {
            if (socket.link !== undefined) {

                if (socket.link.toLowerCase() == show.toLowerCase()) {
                    socket.disconnect()
                }
            }
        })

    }

    getSocketAmount(show) {
        let sockets = this.io.of("/user").sockets;
        let socketsAdmin = this.io.of("/admin").sockets;

        let users = 0;
        let admins = 0;

        sockets.forEach(socket => {
            if (socket.link !== undefined) {
                if (socket.link.toLowerCase() == show.toLowerCase()) {
                    users++;
                }
            }
        })

        socketsAdmin.forEach(socket => {
            if (socket.link !== undefined) {
                if (socket.link.toLowerCase() == show.toLowerCase()) {
                    admins++;

                }
            }
        })
        return { admins: admins, users: users }
    }




    sendAutoEval(link, message) {
        this.getSocketAmount(link);
        assert(link != "");
        assert(link !== undefined);
        assert(link !== null);


        if (message === undefined) {
            throw Error("message is undefined")
        }

        if (message.result === undefined) {
            throw Error("message reulst is undefined")
        }

        let sockets = this.io.of("/user").sockets;

        this.logger.trace("SERVER-AUTO", "udpate show evals for API show: " + link);
        sockets.forEach((socket, index) => {
            if (socket.link !== undefined && socket.link !== null) {
                if (socket.link.toLowerCase() == link.toLowerCase()) {
                    socket.emit("eval_from_server_for_user", message);
                }
            } else {
                console.log(socket.link, " + ", link + " ERROR ");
            }
        });
    }



    updateAllScenesInClients(link) {
        var sockets = this.io.of('/user').sockets;
        let scene = this.flyingDutchman.get_flying_USER_scene(link);
        sockets.forEach((socket, index) => {
            if (socket.link.toLowerCase() == link.toLowerCase()) {
                socket.emit("scene", scene);
            }
        });
    }




    sendModerationRequest(link, message) {
        assert(link != "");
        assert(message != "");
        console.log("sendModerationRequest");
        var sockets = undefined;
        sockets = this.io.of("/admin").sockets;

        this.logger.trace("SERVER-MODERATION-REQ", "udpate show evals for show: " + link + " for namespace: " + message);

        sockets.forEach((socket, index) => {
            if (socket.link !== undefined) {
                if (socket.link.toLowerCase() == link.toLowerCase()) {
                    socket.emit("admin_moderate_this", message);
                }
            } else {
                console.log(link + " ERROR " + namespace);
            }
            // console.log(result);
        });
    }


    validateAdmin(tokenstring, socket, callback) {
        if (tokenstring === undefined || tokenstring == "") {
            console.log("ERROR: the submitted token is empty null or undefined")
            return false;
        }
        let token = tokenstring;

        let temp = this.db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("validation error socket will be disconected");
                    socket.disconnect();
                } else {
                    callback();
                }
            });
    }


    sendToAllAdminSockets(show, header, message) {
        let sockets = this.io.of("/admin").sockets;
        console.log(sockets.length)
        sockets.forEach((socket, index) => {
            if (socket.link !== undefined && socket.link !== null) {
                if (socket.link.toLowerCase() == show.toLowerCase()) {
                    socket.emit(header, message);
                }
            } else {
                console.log(socket.link, " + ", link + " ERROR ");
            }
        });
    }

    start() {
        // ////////////////////////////////////////////
        // ADMIN IdShowe
        // FROM CONTROL UI (3)
        this.adminNamespace.on("connection", (socket) => {
            this.logger.info("NOTICE SOCKET: AN ADMIN CONNECTION ATTEMPT IS STARTET");

            if (socket.handshake.auth.Authorization === undefined) {
                this.logger.error("SERVER", "Admin authorization header not provided");
                this.logger.error(socket.handshake)
                socket.disconnect();
                return;
            }

            let token = socket.handshake.auth.Authorization.slice(7).split("$$$")[0];
            let link = socket.handshake.auth.Authorization.split("$$$")[1];

            if (link === undefined) {
                this.logger.error("SERVER", "link not transmitted" + socket.handshake);
                socket.disconnect();
                return;
            }

            socket.link = link.toLowerCase();

            // check a specific scene is administrated 
            if (socket.link === undefined) {
                this.logger.error("SERVER", "Admin socket conenction: link not transmitted" + socket.handshake);
                socket.disconnect();
                return;
            }

            // check the admin token parameter
            if (token === undefined) {
                console.log("token not transmitted");
                socket.disconnect();
                return;
            }

            // validate token in DBMS
            this.validateAdmin(token, socket, () => {
                this.db.show__get(
                    socket.link,
                    token,
                    (err, rows) => {
                        if (err) {
                            this.logger.error("Server", "error in admin socket validation -> socket got connected immidiatly")
                            socket.disconnect();
                        } else {
                            this.logger.info("SERVER", "Admin socket connection established for show " + socket.link);

                        }
                    })






                socket.on("admin_scene_frontend_move", (msg) => {
                    this.logger.info("SERVER", "admin wants to MOVE scene " + msg);
                    this.db.show__set(socket.link, msg, (newIx) => {
                        socket.emit("goupdate_scene_frontendInShow", newIx);
                        this.flyingDutchman.update_flys(socket.link, () => {
                            this.updateAllScenesInClients(socket.link);
                        });
                    });
                });

                socket.on("admin_scene_frontend_refresh", (msg) => {
                    this.flyingDutchman.update_flys(socket.link, () => {
                        this.updateAllScenesInClients(socket.link);
                    });
                });




                socket.on("admin_scene_stage_move", (newIx) => {
                    // token need to be valid... TODO: token validation
                    this.db.show__setApi(socket.link, newIx, (apiIx) => {
                        this.sendToAllAdminSockets(socket.link, "goupdate_scene_stageInShow", { newIx: newIx, apiIx: apiIx })
                        this.flyingDutchman.update_flys(link, () => {
                            this.apiSockets.setAPIScene(link, apiIx);
                        });
                    });
                });


                socket.on("admin_accept_scene", (msg) => {
                    console.log("ACCEPT scene", msg);

                    // token need to be valid... TODO: token validation
                    this.db.feedback___accept(link, msg.sceneId, msg.feedbackId, (msg) => {
                        this.apiSockets.sendInstandMessage(link, msg.customStageNumber, msg.scenetype, msg.username, msg.message);
                    })
                });
            });
        });





        // ////////////////////////////////////////////
        // CLIENT normal user AREA
        this.userNamespace.on("connection", (socket) => {
            let parts = socket.handshake.headers.referer;

            let compare = this.dev ? "https://localhost" : "https://DOMAIN.com";

            if (!parts.includes(compare)) {
                console.log("USER SOCKET PROTECTION.. rund 'npm run dev?'");
                this.logger.warn("SERVER - SOCKET - USER ", "socket will disco since refere is wrong: " + socket.handshake.headers.referer);
                socket.disconnect();
                return;
            }

            let link = socket.handshake.auth.Authorization;
            socket.link = link.toLowerCase();

            this.logger.trace("SERVER - SOCKET - USER", "new socket connection for show " + socket.link);
            if (socket.link === undefined) {
                this.logger.warn("SERVER - SOCKET - USER ", "socket will disco no link found in referer" + socket.handshake.headers.referer);
                socket.disconnect();
            }

            this.db.show__check_if_online(socket.link, (online) => {
                if (online == 0) {
                    this.logger.info("SERVER - SOCKET - USER", "socket will disco since show " + socket.link + " is offline");
                    console.log("SHOW OFFLINE");
                    socket.disconnect();
                } else {

                    socket.emit("whoami", "nerd-;)-" + jwt.sign({}, socket.link + socket.id, {
                        // expires in 24 hours
                        expiresIn: 86400
                    }))

                    this.logger.info("SERVER - SOCKET - USER", "show " + socket.link + " is online and socket wants a scene..");

                    let scene = this.flyingDutchman.get_flying_USER_scene(socket.link);

                    socket.emit("scene", scene);
                }

                socket.on("call", (msg) => {
                    this.logger.info("SERVER SOCKET client", msg);
                    // enrich msg with header and meta information
                    msg.ip = socket.handshake.address;
                    msg.socketid = socket.id;

                    msg.time = socket.handshake.time
                    msg.agent = socket.handshake.headers['user-agent']

                    let skip = msg.scene.type !== 6
                    this.filter.sceneFilter(msg, skip, (msg) => {
                        // store feedback
                        this.db.feedback___handle(msg, (message, needmod) => {
                            if (needmod) {
                                console.log("need mod")
                                this.sendModerationRequest(socket.link, msg);
                            } else {
                                console.log("no moderation needed");
                                if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(msg.scene.type)) {
                                    this.apiSockets.sendInstandMessage(socket.link, message.scene.customStageNumber, message.scene.type, message.username, message.message);
                                }
                            }
                        });
                    })
                });
            });
        });

        this.logger.info("HUMAN SOCKET", "started")
    }
}