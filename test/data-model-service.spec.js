const { describe } = require('mocha');
const { expect } = require('chai');
const { getEngineersList, executeScheduler, resetSchedules } = require('../service/data-model-service');
require('dotenv').config();

beforeEach(() => {
   resetSchedules();
});

describe('data-model-service', () => {
    describe('getEngineersList()', () => {
        it('should test that data is read and returned correctly', () => {
            const testObjectKeys = [ 'id', 'name', 'supportDate' ];

            const returnedData = getEngineersList();

            expect(returnedData.length).to.equal(10);
            expect(typeof returnedData[0]).to.equal('object');
            expect(Object.keys(returnedData[0])).to.eql(testObjectKeys);
        });
    });

    describe('executeScheduler()', () => {
        it('should test the scheduler assigns engineers to support for 1 day and the rest of the days to be unassigned', () => {

            const returnedScheduler = executeScheduler();

            expect(returnedScheduler).to.not.be.undefined;
            expect(returnedScheduler.supportDay).to.equal('1');
            expect(returnedScheduler.scheduleList[0].day).to.equal('DAY_1');
            expect(returnedScheduler.scheduleList[0].engineersForSupport.length).to.equal(2);

            for (let i = 1; i < returnedScheduler.scheduleList.length; i++) {
                expect(returnedScheduler.scheduleList[i]).to.be.undefined;
            }
        });

        it('check if calling 2 times the executeScheduler works as expected', () => {

            executeScheduler();
            const returnedScheduler = executeScheduler();

            expect(returnedScheduler).to.not.be.undefined;
            expect(returnedScheduler.supportDay).to.equal('2');
            expect(returnedScheduler.scheduleList[0].day).to.equal('DAY_1');
            expect(returnedScheduler.scheduleList[0].engineersForSupport.length).to.equal(2);
            expect(returnedScheduler.scheduleList[1].day).to.equal('DAY_2');
            expect(returnedScheduler.scheduleList[1].engineersForSupport.length).to.equal(2);

            for (let i = 2; i < returnedScheduler.scheduleList.length; i++) {
                expect(returnedScheduler.scheduleList[i]).to.be.undefined;
            }
        });
    });

    describe('resetSchedules()', () => {
        it('should test that reset sets back data to initial values', () => {
            const engineersList = getEngineersList();

            executeScheduler();
            executeScheduler();

            resetSchedules();

            const resettedEngineersList = getEngineersList();

            expect(engineersList).to.eql(resettedEngineersList);
            expect(process.env.SUPPORT_DAY).to.equal('1');
        });
    });
});