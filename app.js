const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./route_controller/support-controller");
const { populateDataFile } = require('./util/file-util');

const app = express();

require('dotenv').config();

//prepopulate the data.json file used to store and write data to with fresh test data.
populateDataFile();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({"extended": false}));
app.use(cookieParser());

app.use( (req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.error(err.message);
    res.send(`An error has occurred --> ${ err.message }`);
});

module.exports = app;
