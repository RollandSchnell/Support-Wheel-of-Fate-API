/**
 * Generate a random number between 1 and 10, used to pick an engineer randomly.
 * @returns {number}
 */
const getRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 1;
};

module.exports.getRandomNumber = getRandomNumber;