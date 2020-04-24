const fs = require('fs');

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

const writeToFile = (data, path) => {
    if (data !== undefined && data !== '') {
        try {
            fs.writeFileSync(path, data, (err, data) => {
                console.log('Objects written to file');
            })
        } catch (err) {
            throw new Error(`Could not write objects to file, ${err.message}`);
        }
    }
};

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