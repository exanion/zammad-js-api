/**
 * ZammadApi top level and helper functions
 * @author Peter Kappelt
 */

const axios = require("axios");
const endpoints = require("./Endpoints");

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
     * @throws Error if not an object
     * @todo custom error classes
     */
    _isObjectOrError(data) {
        if (typeof data !== "object") {
            throw new Error("Type of checked data is not object!");
        }
    }

    async doGetCall(endpoint) {
        let response = await axios.get(this.host + endpoints.PREFIX + endpoint);
        this._isObjectOrError(response);
        return response.data;
    }
}

module.exports = ZammadApi;
