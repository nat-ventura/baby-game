require('dotenv').config();
const Sequelize = require('sequelize');
const pg = require('pg');

const sequelize = new Sequelize(`postgres:/{process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

sequelize
    .authenticate()
    .then(() => {
        console.log('connect has been established successfully');
    })
    .catch(err => {
        console.error('unable to connect to the database:', err);
    });

const db = {}

// models/tables
db.account = require('./models/account.js')(sequelize, Sequelize);
db.progress = require('./models/progress.js')(sequelize, Sequelize);

module.exports = db;