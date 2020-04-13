/**
 * ZammadApi top level and helper functions
 * @author Peter Kappelt
 */

const axios = require("axios");
const endpoints = require("./Endpoints");
const ApiError = require("./ApiError");

class ZammadApi {
    /**
     * Connect to a zammad API
     * @param {*} host Hostname of Zammad instance with protocol and port
     * @todo hostname check and sanitising
     */
    constructor(host) {
        this.host = host;
    }

    /**
     * Throws an error if the given data is not an object
     * @param {*} data Data to be checked
     * @throws ApiError.UnexpectedResponse if not an object
     */
    _isObjectOrError(data) {
        if (typeof data !== "object") {
            throw new ApiError.UnexpectedResponse(
                "Type of checked data is not object!",
                "object",
                typeof data
            );
        }
    }

    /**
     * Check axios http response code
     * @param {*} res Axios response
     */
    _checkResponseCode(res) {
        if (res.status !== 200 && res.status !== 201) {
            throw new ApiError.UnexpectedResponse(
                "Unexpected response code",
                "200/ 201",
                res.status
            );
        }
    }

    /**
     * Perform a get call on a given endpoint, return result
     * @param {*} endpoint Endpoint to call
     */
    async doGetCall(endpoint) {
        return await this.doGetCallWithParams(endpoint, {});
    }

    /**
     * Perform a get call on a given endpoint with
     * additional query parameters, return result
     * @param {*} endpoint Endpoint to call
     * @param {*} params associative array in form "param": "value"
     */
    async doGetCallWithParams(endpoint, params) {
        let response = await axios.get(
            this.host + endpoints.PREFIX + endpoint,
            {
                params,
            }
        );
        this._isObjectOrError(response.data);
        this._checkResponseCode(response);
        return response.data;
    }

    /**
     * Perform a post call on a given endpoint, return result
     * @param {*} endpoint Endpoint to call
     * @param {string|object} body Body of the post request
     */
    async doPostCall(endpoint, body) {
        let response = await axios.post(
            this.host + endpoints.PREFIX + endpoint,
            body
        );
        this._isObjectOrError(response.data);
        this._checkResponseCode(response);
        return response.data;
    }

    async doPutCall(endpoint, body) {
        let response = await axios.put(
            this.host + endpoints.PREFIX + endpoint,
            body
        );
        this._isObjectOrError(response.data);
        this._checkResponseCode(response);
        return response.data;
    }

    async doDeleteCall(endpoint) {
        let response = await axios.delete(
            this.host + endpoints.PREFIX + endpoint
        );
        this._isObjectOrError(response.data);
        this._checkResponseCode(response);
        return response.data;
    }
}

module.exports = ZammadApi;
