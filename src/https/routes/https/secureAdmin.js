
import express, { Router } from "express";
import { stringify, fileSysCheck } from "../../../utils/helpers.js";
import multer from 'multer';
import path from "path";
import fs from "fs";

export default function (logger, db) {

    const router = express.Router();


    var upload = multer({
        dest: '/tmp'
    })


    const handleError = (err, res) => {
        console.log(err);
        res
            .status(500)
            .contentType("text/plain")
            .end("Oops! Something went wrong!");
    };

    router.put('/upload', upload.single("file"), (req, res) => {

        console.log("in the upload");
        let token = req.headers.authorization.slice(7);

        let target = req.query.target;

        let targetName = "";
        if (target == 1) {
            targetName = "logo.png";
        } else if (target == 2) {
            targetName = "default.png";
        } else {
            return res.status(423).send('Not target submitted');

        }

        db.security__validate_token(
            token
            , (err, user) => {
                var targetpathLocal = "public/" + req.query.link + "/";
                const tempPath = req.file.path;
                const targetPath = targetpathLocal;

                if (path.extname(req.file.originalname).toLowerCase() === ".png") {
                    fs.rename(tempPath, targetPath + targetName, err => {
                        if (err) return handleError(err, res);
                        res
                            .status(200)
                            .contentType("text/plain")
                            .end("File uploaded!");
                    });
                } else {
                    fs.unlink(tempPath, err => {
                        if (err) return handleError(err, res);

                        res
                            .status(403)
                            .contentType("text/plain")
                            .end("Only .png files are allowed!");
                    });
                }
            });
    });

    /*
    @notused
    */
    router.delete('/deleteimage', (req, res) => { });


    router.post('/reseteval', (req, res) => {
        let token = req.headers.authorization.slice(7);
        console.log("reseteval")
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitations process, token is not valid: ");
                    console.log(token);
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.feedback___reset(
                        token,
                        req.query.scid
                        , (err, result) => {
                            if (err) {
                                return res.status(500).send('Scene could not be delted');
                            } else {
                                res.status(200).send("Scene got deleted");
                            }
                        });
                }
            });
    });

    router.delete('/deleteshow', (req, res) => {
        console.log("DELETE SHOW");
        let token = req.headers.authorization.slice(7);
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitations process, token is not valid: ");
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.show__delete(
                        req.query.Link,
                        token
                        , (err, result) => {
                            if (err) {
                                return res.status(500).send('Scene could not be delted');
                            } else {
                                res.status(200).send("Scene got deleted");
                            }
                        });
                }
            });
    });

    router.delete('/deletescene', (req, res) => {
        let token = req.headers.authorization.slice(7);
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitation process, token is not valid: ");
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.scene___delete(
                        req.query.scid,
                        req.query.Link,
                        token
                        , (err, result) => {
                            if (err) {
                                return res.status(500).send('Scene could not be delted');
                            } else {
                                res.status(200).send("Scene got deleted");
                            }
                        });
                }
            });
    });

    router.put('/countdownstart', (req, res) => {
        console.log("COUNTDOWNStART");
        let token = req.headers.authorization.slice(7);
        let updates = req.body;

        // TODO: more check ups 
        if (updates === undefined) {
            res.status(501).send("corrupt data");
        }
        updates.countdownstart = Date.now();
        console.log(updates);
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitations process, token is not valid: ");
                    console.log(token);
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.scene__update(
                        updates
                        , (err, result) => {
                            if (err) {
                                return res.status(500).send('Error update on the server, scene could not be updated');
                            } else {
                                res.status(200).send("update succesfull");
                            }
                        });
                }
            });
    });



    router.put('/countdownreset', (req, res) => {
        console.log("countdownreset");
        let token = req.headers.authorization.slice(7);
        let updates = req.body;

        // TODO: more check ups 
        if (updates === undefined) {
            res.status(501).send("corrupt data");
        }

        updates.countdownstart = 0;
        console.log(updates);
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitations process, token is not valid: ");
                    console.log(token);
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.scene__update(
                        updates
                        , (err, result) => {
                            if (err) {
                                return res.status(500).send('Error update on the server, scene could not be updated');
                            } else {
                                res.status(200).send("update succesfull");
                            }
                        });
                }
            });
    });

    router.put('/updateshow', (req, res) => {
        let token = req.headers.authorization.slice(7);
        let show = req.body;
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitations process, token is not valid: ");
                    console.log(token);
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.show__update({
                        token: req.headers.authorization.slice(7),
                        name: '"' + show.name + '"',
                        online: show.online,
                        link: '"' + show.link + '"',
                        title_image: '"' + show.title_image + '"',
                        api_key: '"' + show.api_key + '"',
                        offline_text: '"' + show.offline_text + '"',
                        offline_name: '"' + show.offline_name + '"',
                        stream_link: '"' + show.stream_link + '"',

                    }, (err, result) => {
                        if (err) {
                            return res.status(500).send('Datebase server could not update show');
                        } else {
                            res.status(200).send("update succefull");
                        }
                    });
                }
            });
    });

    router.put('/update_scene_frontend', (req, res) => {
        let token = req.headers.authorization.slice(7);
        let updates = req.body;
        console.log("scene (ID:" + updates.ID + ") wird geupdated")
        // TODO: more check ups 
        if (updates === undefined) {
            res.status(501).send("corrupt data");
        }
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitations process, token is not valid: ");
                    console.log(token);
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.scene__update(
                        updates
                        , (err, result) => {
                            if (err) {
                                return res.status(500).send('Error update on the server, scene could not be updated');
                            } else {
                                res.status(200).send("update succesfull");
                            }
                        });
                }
            });
    });


    router.post('/newscene', (req, res) => {
        let token = req.headers.authorization.slice(7);
        let link = req.query.Link;
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    console.log("ERROR in Valitations process, token is not valid: ");
                    console.log(token);
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.scene__insert_new({
                        token: token,
                        link: link,
                    }, (err, result) => {
                        if (err) {
                            return res.status(500).send('Error on the server when trying to add new scene');
                        } else {
                            res.status(200).send(result);
                        }
                    });
                }
            });
    });

    router.get('/scenes_frontend', (req, res) => {
        logger.debug("API", "GET/scenes_frontend")
        let token = req.headers.authorization.slice(7);
        let link = req.query.Link;
        logger.trace("API", "GET/scenes_frontend exfill " + token + " " + link)
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    logger.warn("API", "GET/scenes_frontend " + err);
                    console.log("ERROR in Valitations process, token is not valid: ");
                    console.log(token);
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.scene__get_all(link, token, (err, result) => {
                        if (err) {
                            logger.warn("API", "GET/scenes_frontend " + err);
                            return res.status(500).send('Error on the server.');
                        } else {
                            logger.debug("API", "GET/scenes_frontend RESPONSE " + result);

                            res.status(200).send(result);
                        }
                    });
                }
            });
    });




    router.put('/newshow', (req, res) => {
        logger.trace("API", "GET/SHOW " + req)
        let token = req.headers.authorization.slice(7);
        let link = req.query.Link;
        let name = req.query.name;


        if (link.length == 0 || link.length === undefined) {
            return res.status(501).send('link zu kurz oder fehlerhaft');
        }

        if (link.length > 10) {
            return res.status(502).send('link zu lange');
        }

        if (!/^[a-zA-Z]+$/.test(link)) {
            return res.status(503).send('link erhält unterlaubte zeichen');
        }

        if (link !== link.toUpperCase()) {
            return res.status(504).send('nur Grossbuchstaben für Link erlaubt');
        }

        if (name.length == 0 || name.length === undefined) {
            return res.status(511).send('name zu kurz oder fehlerhaft');
        }

        if (name.length > 150) {
            return res.status(512).send('name zu lange');
        }

        if (!/^[a-zA-Z]+$/.test(name)) {
            return res.status(513).send('name erhält unterlaubte zeichen');
        }


        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    logger.error("API", "ERROR in Valitations process, token is not valid: " + token)
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.show__insert_new(
                        name,
                        link,
                        token
                        , (err) => {
                            if (err) {

                                console.log(err);
                                if (err.code == "ER_DUP_ENTRY") {
                                    res.status(555).send('Der Show ist bereits vergeben');
                                } else {
                                    res.status(500).send('hat nicht geklappt', err.code);

                                }
                                logger.error("API", "PUT/SHOW-ERRORRED " + err)
                                return
                            } else {

                                fileSysCheck([{ link: link }], logger);


                                res.status(200).send("Show wurde erfolgreich erstellt");
                                logger.trace("API", "PUTSHOW-SUCCESFULL");
                                return
                            }
                        });
                }
            });
    });


    router.get('/show', (req, res) => {
        logger.trace("API", "GET/SHOW " + req)
        let token = req.headers.authorization.slice(7);
        let link = req.query.Link;
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    logger.error("API", "ERROR in Valitations process, token is not valid: " + token)
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.show__get(
                        link,
                        token,
                        (err, result) => {
                            if (err) {
                                res.status(500).send('there could not any show beeing retrieved');
                                logger.error("API", "GET/SHOW-ERRORRED" + res)
                                return
                            } else {
                                res.status(200).send(result);
                                logger.trace("API", "GET/SHOW-SUCCESFULL Result" + JSON.stringify(result.toString()))
                                return
                            }
                        });
                }
            });
    });




    router.get('/shows', (req, res) => {
        logger.trace("API", "GET/SHOWS " + req)
        let token = req.headers.authorization.slice(7);
        db.security__validate_token(
            token
            , (err, user) => {
                if (err) {
                    logger.error("API", "ERROR in Valitations process, token is not valid: " + token)
                    return res.status(500).send('Authentification denied, token not valid');
                } else {
                    db.show__get_by_token(
                        token
                        , (err, result) => {
                            if (err) {
                                res.status(500).send('the show could not be retrieved');
                                logger.error("API", "GET/SHOW-ERRORRED" + res + " ERROR: " + err)
                                return
                            } else {
                                res.status(200).send(result);
                                logger.trace("API", "GET/SHOWS-SUCCESFULL Result" + stringify(result))
                                return
                            }
                        });
                }
            });
    });
    return router;
}








