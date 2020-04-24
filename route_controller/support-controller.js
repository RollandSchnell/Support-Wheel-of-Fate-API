const express = require('express');
const { getEngineersList, executeScheduler, resetSchedules } = require('../service/data-model-service');
const { GenericError } = require('../errors/generic-error');
const router = express.Router();

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

router.post('/reset', (req, res, next) => {
    try {
        resetSchedules();

        res.status(200)
            .json('OK');

    } catch (err) {
        res.status(500)
            .json(new GenericError('Something went wrong resetting the data', err));
    }
});

module.exports = router;
