const express = require('express');
const { getEngineersList, executeScheduler, resetSchedules } = require('../service/data-model-service');
const { GenericError } = require('../errors/generic-error');
const router = express.Router();

/**
 * Main route controller for the application this handles all requests mapped from "/" route
 */

/**
 * For testing purposes, it returns the full engineer scheduled list from data.json
 */
router.get('/list', (req, res, next) => {
    try {
        const data = getEngineersList();

        res.status(200)
            .json(data);
    } catch (err) {
        res.status(500)
            .json(new GenericError('Cannot get list of engineers', err));
    }
});

/**
 * The main app route used to assign 2 random engineers for support for a given day, this follows a counter from 1 to 20
 * being the 20 working days in a month.
 */
router.post('/assign-support', (req, res, next) => {
    try {
        const schedulerResult = executeScheduler();

        res.status(200)
            .json(schedulerResult);

    } catch (err) {
        res.status(500)
            .json(new GenericError('Cannot assign engineers to a support day', err));
    }
});

/**
 * For testing purposes, this resets all application data to initial ones.
 */
router.post('/reset', (req, res, next) => {
    try {
        resetSchedules();

        res.status(200)
            .json({status: 'OK', fullSchedule: false});

    } catch (err) {
        res.status(500)
            .json(new GenericError('Something went wrong resetting the data', err));
    }
});

module.exports = router;
