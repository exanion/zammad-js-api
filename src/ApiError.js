/**
 * Various class definitions for errors that occur during API calls
 * @author Peter Kappelt
 */

class ApiError extends Error {
    /**
     * Instantiate a new Zammad Api Error object
     * @param {*} message Message of this error
     */
    constructor(message) {
        super(`[ZammadApiError] ${message}`);
        this.name = "ZammadApiError";
    }
}

class UnexpectedResponse extends ApiError {
    /**
     * Instantiate a new UnexpectedResponse error object
     * @param {*} message Message to show user
     * @param {*} expected Data type/ data that was expected to be received
     * @param {*} received Data type/ data that was actually received
     */
    constructor(message, expected, received) {
        super(`[UnexpectedResponse] ${message}`);
        this.name = "ZammadApiError.UnexpectedResponse";

        this.expected = expected;
        this.received = received;
    }
}

class InvalidRequest extends ApiError {
    /**
     * Instantiate a new InvalidRequest error object
     * @param {*} message Message to store
     */
    constructor(message) {
        super(`[InvalidRequest] ${message}`);
        this.name = "ZammadApiError.InvalidRequest";
    }
}

class Unimplemented extends ApiError {
    /**
     * Instantiate a new Unimplemented error object
     */
    constructor(message = null) {
        super(`[Unimplemented] ${message}`);
        this.name = "ZammadApiError.Unimplemented";
    }
}

module.exports = {
    ApiError,
    UnexpectedResponse,
    InvalidRequest,
    Unimplemented,
};
