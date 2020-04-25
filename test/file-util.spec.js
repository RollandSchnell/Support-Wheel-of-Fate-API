const { describe } = require('mocha');
const { expect } = require('chai');
const { readFromFile, writeToFile, populateDataFile } = require('../util/file-util');
require('dotenv').config();

describe('file-util', () => {
    describe('readFromFile()', () => {
        it('should test that data is read from a given file', () => {
            const testFilePath = process.cwd() + process.env.DATA_FILE;

            const testData = readFromFile(testFilePath);

            expect(testData).to.not.be.undefined;
        });

        it('should test that error is thrown when file path is not given', () => {
            const testFilePath = '';

            const testData = readFromFile(testFilePath);

            expect(testData).to.be.undefined;
        });
    });

    describe('writeToFile()', () => {
        it('should test that data is written to a given file', () => {
            const testFilePath = process.cwd() + process.env.DATA_FILE;
            const testData = {value: 'test'};

            writeToFile(JSON.stringify(testData), testFilePath);

            const testFileValue = JSON.parse(readFromFile(testFilePath));

            expect(testFileValue).to.eql(testData);
        });

        it('should test that error is thrown when data is not given', () => {
            const testFilePath = process.cwd() + process.env.DATA_FILE;
            const testData = '';

            expect(() => writeToFile(testData, testFilePath)).to.throw();
        });
    });

    describe('populateDataFile()', () => {
        it('should test that fresh data is loaded in data.json', () => {
            const testFilePathDestination = process.cwd() + process.env.DATA_FILE;
            const testFilePathOrigin = process.cwd() + process.env.ORIGINAL_TEST_FILE;
            const testDataOrigin = readFromFile(testFilePathOrigin);

            populateDataFile();

            const testDataDestination = readFromFile(testFilePathDestination);

            expect(testDataDestination).to.eql(testDataOrigin);
        });
    });
});