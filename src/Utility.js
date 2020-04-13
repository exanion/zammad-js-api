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
};
