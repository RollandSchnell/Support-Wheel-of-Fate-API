const Engineer = require('../model/engineer');
const { getRandomNumber } = require('../util/random-generator');
const { readFromFile, writeToFile, populateDataFile } = require('../util/file-util');
const { days } = require('../constants/constants');

const parseRawDataToObjectArray = rawData => {
    let engineerArray = [];

    if (rawData) {
        try {
            const parsedData = JSON.parse(rawData);
            engineerArray = parsedData.map(engineer => new Engineer(engineer));
        } catch (err) {
            throw new Error(`Could not parse objects, ${err.message}`);
        }
    }

    return engineerArray;
};

const executeScheduler = () => {
    const engineersList = getEngineersList();
    const supportDay = process.env.SUPPORT_DAY;

    if (checkForFullSchedule(engineersList)) {
        return {
            supportDay,
            engineersList,
            fullSchedule: true
        }
    } else {
        assignEngineersForSupport(engineersList, supportDay);
        return {
            supportDay,
            engineersList: getEngineersList(),
            fullSchedule: false
        }
    }
};

const getEngineersList = () => {
    const absolutePath = process.cwd() + process.env.DATA_FILE;
    const rawData = readFromFile(absolutePath);
    return parseRawDataToObjectArray(rawData);
};

const assignEngineersForSupport = (engineersList, supportDay) => {
    const absolutePath = process.cwd() + process.env.DATA_FILE;
    const engOne = getEngineerForSupport(engineersList);
    let engTwo = getEngineerForSupport(engineersList);

    while (engOne.id === engTwo.id) {
        engTwo = getEngineerForSupport(engineersList);
    }

    if (engOne && engTwo) {
        const index1 = engineersList.findIndex(engineer => engineer.id === engOne.id);
        const index2 = engineersList.findIndex(engineer => engineer.id === engTwo.id);

        engineersList[index1].addSupportDate(days.filter(day => day.value === supportDay)[0].name);
        engineersList[index2].addSupportDate(days.filter(day => day.value === supportDay)[0].name);

        writeToFile(JSON.stringify(engineersList), absolutePath);

        process.env.SUPPORT_DAY++;
    }

    console.log(engineersList);
};

const getEngineerForSupport = (engineersList) => {
    const randomId = getRandomNumber();
    const engineer = engineersList.filter(engineer => engineer.id === randomId)[0];
    const noSupportDayEngineer = engineersList.find(engineer => engineer.getSupportDate().length === 0);

    if (engineer.getSupportDate().length === 0) {
        return engineer;
    }

    if (noSupportDayEngineer) {
        return noSupportDayEngineer;
    }

    if (engineer.getSupportDate().length === 2) {
        return getEngineerForSupport(engineersList);
    }

    return engineer;
};

const checkForFullSchedule = engineersList => {
    return !!!engineersList.find(engineer => engineer.supportDate.length < 2);
};

const resetSchedules = () => {
    process.env.SUPPORT_DAY = 1;
    populateDataFile();
};

module.exports = {
    getEngineersList,
    executeScheduler,
    resetSchedules
};