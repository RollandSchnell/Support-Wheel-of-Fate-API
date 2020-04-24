
class GenericError {
    constructor (description, error) {
        this.error = !!error;
        this.description = description;
        this.code = error.statusCode;
        this.message = error.message;
    }
}

module.exports.GenericError = GenericError;