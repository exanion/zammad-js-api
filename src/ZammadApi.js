/**
 * ZammadApi top level and helper functions
 * @author Peter Kappelt
 */

const _axios = require("axios");
let axios;
const endpoints = require("./Endpoints");
const ApiError = require("./ApiError");

class ZammadApi {
    /**
     * Connect to a zammad API
     * @param {string} host Hostname of Zammad instance with protocol and port
     * @param {string} username Username for authentication
     * @param {string} password Password for authentication
     * @todo hostname check and sanitising
     */
    constructor(host, username, password) {
        this.host = host;
        this.username = username;
        this.password = password;
        axios = _axios.create({
            baseURL: this.host + endpoints.PREFIX,
            auth: {
                username,
                password,
            },
            headers: {
                "User-Agent": "Zammad Mobile by Exanion/1.0"
            }
        });
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
        let response = await axios.get(endpoint, {
            params,
        });
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
        let response = await axios.post(endpoint, body);
        this._isObjectOrError(response.data);
        this._checkResponseCode(response);
        return response.data;
    }

    async doPutCall(endpoint, body) {
        let response = await axios.put(endpoint, body);
        this._isObjectOrError(response.data);
        this._checkResponseCode(response);
        return response.data;
    }

    async doDeleteCall(endpoint) {
        let response = await axios.delete(endpoint);
        this._isObjectOrError(response.data);
        this._checkResponseCode(response);
        return response.data;
    }
}

module.exports = ZammadApi;
