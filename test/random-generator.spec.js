const { describe } = require('mocha');
const { expect } = require('chai');
const { getRandomNumber } = require('../util/random-generator');

describe('random-generator', () => {
    describe('getRandomNumber()', () => {
        it('should test that the random generator returns numbers in range 1-10', () => {
            const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            for (let i = 0; i < 1000; i++) {
                expect(testArray.includes(getRandomNumber())).to.be.true;
            }
        });
    });
});