/**
 * Various utility functions
 * @author Peter Kappelt
 */

const ApiError = require("./ApiError");

module.exports = {
    Validators: {
        AssertInt: (check) => {
            if (check != parseInt(check)) {
                throw new ApiError.InvalidRequest("Expected integer");
            }

            return parseInt(check);
        },
    },
    /**
     * Throw ApiError.UnexpectedResponse if key is not in object
     * @param {object} object object to check
     * @param {string} key key that the object shall have
     * @throws ApiError.UnexpectedResponse
     */
    ObjectHasKeyOrUnexpectedResponse: (object, key) => {
        if (!(key in object)) {
            throw new ApiError.UnexpectedResponse(
                `${key} attribute missing`,
                `${key} field`,
                `no ${key} field present`
            );
        }
    },
};
