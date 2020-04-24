/**
 * Main application service that handles all the application logic for assigning engineers to working days.
 */

const Engineer = require('../model/engineer');
const { getRandomNumber } = require('../util/random-generator');
const { readFromFile, writeToFile, populateDataFile } = require('../util/file-util');
const { days } = require('../constants/constants');

/**
 * It creates an Engineer array of objects from raw data read from a file.
 * @param rawData
 * @returns {[Engineer]}
 */
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
/**
 * Entry function for the application logic, check if we are at last day of the month and reset the app data, check if all
 * the engineers are scheduled for a support day and reset their support counters, this happens every 2 weeks since there are 10
 * engineers thus 2 weeks consists of 10 working days. Ultimately assign 2 random engineers for support for the current working day.
 * @returns {{scheduleList: Array[], supportDay: String}}
 */
const executeScheduler = () => {

    checkForEndOfMonth();
    checkForFullSchedule();
    assignEngineersForSupport();

    const scheduleResult = {
        supportDay: process.env.SUPPORT_DAY,
        scheduleList: formatEngineersListByDate(getEngineersList())
    };

    // this the counter for the current working day, after we finished the assignment
    // for the next call we will use the next day's value.
    process.env.SUPPORT_DAY++;

    return scheduleResult;
};

/**
 * Read the data.json file parse and return an engineer array.
 * @returns {Engineer[]}
 */
const getEngineersList = () => {
    const absolutePath = process.cwd() + process.env.DATA_FILE;
    const rawData = readFromFile(absolutePath);
    return parseRawDataToObjectArray(rawData);
};

/**
 * Pick 2 random engineers from the created engineer array, if they happen to  be the the same repeat until they are different.
 * Assign them for support for the current working day, modify the engineer array with the new values and write it to the data.json file.
 */
const assignEngineersForSupport = () => {
    const engineersList = getEngineersList();
    const absolutePath = process.cwd() + process.env.DATA_FILE;
    const supportDay = process.env.SUPPORT_DAY;
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
    }
};

/**
 * Recursive function used to get an engineer for the next support day. First pick one random number between 1 and 10
 * (since there are 10 engineers) filter it from the engineers list, if this engineer has no support scheduled yet it will be
 * returned. If the first engineer already had a support day search for someone else who wasn't on support yet and return it
 * this is an extra measure to avoid picking the same engineer for the same day twice. Ultimately if the randomly chosen
 * engineer was on support 2 times repeat the search process (recursive call).
 * @param engineersList
 * @returns {Engineer}
 */
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

/**
 * Check if all the engineers already were 2 times on support (this should happen after 10 days) and reset their
 * support counter so they can go on support again, ultimately save the newly created list to data.json.
 */
const checkForFullSchedule = () => {
    const engineersList = getEngineersList();
    const absolutePath = process.cwd() + process.env.DATA_FILE;
    const isListFullyScheduled = !!!engineersList.find(engineer => engineer.supportDate.length < 2);

    if (isListFullyScheduled) {
        engineersList.forEach(engineer => engineer.resetSupportDate());
        writeToFile(JSON.stringify(engineersList), absolutePath)
    }
};

/**
 * If we are at the end of the month (20 working days passed) reset the current day counter as well as all application data.
 * Thus the process can be started again.
 */
const checkForEndOfMonth = () => {
   if (process.env.SUPPORT_DAY > 20) {
       resetSchedules();
   }
};

/**
 * Function used to reset all application data.
 */
const resetSchedules = () => {
    process.env.SUPPORT_DAY = 1;
    populateDataFile();
};

/**
 * This a purely formatter function that takes the engineers list and returns a day oriented view of the scheduled program,
 * like this is more readable in the UI. EX: { day: 'DAY_1', engineersForSupport: 'ENG_1', 'ENG_2' }
 * @param engineersList
 * @returns {*[]}
 */
const formatEngineersListByDate = engineersList => {
   return days.map(day => {
      const dayAtr = day.name;
      const engineersForSelectedDay = engineersList.filter(engineer => engineer.supportDate.find(date => date === dayAtr) !== undefined);

      return engineersForSelectedDay.length > 0 ? {
          day: day.name,
          engineersForSupport: engineersForSelectedDay.map(engineer => engineer.name)
      } : undefined;
  })
};

module.exports = {
    getEngineersList,
    executeScheduler,
    resetSchedules
};