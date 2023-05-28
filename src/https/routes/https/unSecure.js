
import express, { Router } from "express";
import {strcmp} from "../../../utils/helpers.js";
import jwt from "jsonwebtoken";


export default function (logger, db) {

    let jwtConfig = {
      'secret': 'your_secret'
    }
    const router = express.Router();

    router.get('/valid', async (req, res) => {
        let token = req.headers.authorization.slice(7);
        logger.trace("API", "VALIDION REQUEST FROM  " + token);
  
        if (req.headers.authorization === undefined) {
          console.log("ERROR: no token submitted");
          logger.error("API", "NO TOKEN WAS SUBMITTED");
          return res.status(500).send('Authentification denied, no token submitted');
        }
        db.security__validate_token(
          token
          , (err, user) => {
            if (err || user === undefined) {
              logger.info("API", "TOKEN WAS NOT VALID " + token);
              return res.status(500).send('Authentification denied, token not valid');
            } else {
              logger.info("API", "Token succesfull validated for " + user);
              res.status(200).send("validation succesful");
            }
          });
      });
      
  router.post('/login', async (req, res) => {
    logger.info("API", "The admin login attempt from " + req.body.email);
    await new Promise(r => setTimeout(r, 2000));

    db.security__get_user_by_email(req.body.email, (err, user) => {
      if (err) {
        logger.error("API", "Login Attempt errored: " + err + " from " + req.body.email);
        return res.status(500).send('Error on the server.');
      }
      if (!user) {
        logger.info("API", "Login Attempt unsussesfull - user not found: " + req.body.email);
        return res.status(401).send('No user found.');
      }
      if (strcmp(req.body.email, user.email)) {
        console.log("wer wre here");
        // ENCRYPTION!!!!!!!!!!!!!
        // let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        // REALY REALY BAD
        let passwordIsValid = req.body.password == user.password;
        if (!passwordIsValid) {
          logger.info("API", "Login Attempt unsussesfull - user pw not correct: " + req.body.email);
          return res.status(401).send("Passwort war nicht korrekt");
        }
        let token = jwt.sign({
          id: user.id
        },
        jwtConfig.secret, {
          // expires in 24 hours
          expiresIn: 86400
        }
        );

        logger.trace("API", "Token generated " + token);
        db.security__insert_token(user.email, token);
        console.log("SEND SUCCESFLL LOGIN");

        res.status(200).send({
          auth: true,
          token: token,
          user: user.name,
          email: user.email
        });
        logger.info("API", "Login succefull for " + req.body.email);
      }
    });
  });

  // HERE HERE HERE
  router.get('/showUser', (req, res) => {
    let link = req.headers.show;

    if (link === undefined) {
      return res.status(500).send('LINK');
    }

    db.show__get_by_link_for_non_admin(
      link
      ,
      (err, result) => {
        if (err) {
          console.log("could not get scene id");
          return res.status(500).send('could not get scene id');
        } else {
          if (result.length > 0) {
            let packet = {}
            packet.offline_name = result[0].offline_name;
            packet.offline_text = result[0].offline_text;
            packet.title_image = result[0].title_image;
            packet.stream_link = result[0].stream_link;
            packet.image = result[0].image;
            packet.logo = result[0].logo;
            res.send(packet);
          } else {
            return res.status(404).send('No show found.');
          }

        }
      }
    )
  });
    return router;
}









