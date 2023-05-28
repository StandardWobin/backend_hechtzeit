// config file for databse access
export default {
    HOST: "localhost",
    USER: "USER",
    PASSWORD: "enter passwort here",
    DB: "enter sheme here",
    PORT: DBPORT,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };