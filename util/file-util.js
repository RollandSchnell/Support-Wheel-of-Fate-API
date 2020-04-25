const fs = require('fs');
/**
 * Util function that reads data from a given file.
 * @param path
 * @returns {*}
 */
const readFromFile = path => {
    if (path) {
        try {
            return fs.readFileSync(path);
        } catch (err) {
            throw new Error(`Could not read objects from file ${path}, ${err}`);
        }
    } else {
        console.log('The file is empty');
    }
};

/**
 * Util function that writes a String to a given file.
 * @param data
 * @param path
 */
const writeToFile = (data, path) => {
    if (data !== undefined && data !== '' && path !== '') {
        try {
            fs.writeFileSync(path, data, (err, data) => {
                console.log('Objects written to file');
            })
        } catch (err) {
            throw new Error(`Could not write objects to file, ${err.message}`);
        }
    } else {
        throw new Error(`Could not write objects to file, data or path missing`);
    }
};

/**
 * Used to copy a fresh version of initial testing data to the data.json file which will be used to read and write to
 * in the process of assigning engineers, it is used in resetting application data.
 */
const populateDataFile = () => {
    const originalFileAbsolutePath = process.cwd() + process.env.ORIGINAL_TEST_FILE;
    const dataFileAbsolutePath = process.cwd() + process.env.DATA_FILE;
    const originalFile = readFromFile(originalFileAbsolutePath);

    if (originalFile) {
        writeToFile(originalFile, dataFileAbsolutePath);
    }
};

module.exports = {
    readFromFile,
    writeToFile,
    populateDataFile
};