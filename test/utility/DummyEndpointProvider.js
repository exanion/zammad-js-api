/**
 * Provides an http server with dummy endpoints that imitate a
 * Zammad instance for testing purposes
 * @author Peter Kappelt
 */

const express = require("express");

class DummyEndpointProvider {
    /**
     * Create a new dummy endpoint provider
     * @param {*} port HTTP port to listen on
     * @param {*} prefix Prefix path for all APIs, without leading slash!
     */
    constructor(port, prefix) {
        this.port = port;
        this.prefix = prefix;
        this.endpoints = {};

        this.app = express();
        this.app.use(express.json());

        this.server = this.app.listen(port, () => {
            console.log(
                `[Test.DummyEndpointProvider] Started dummy endpoint http provider on port ${port}`
            );
        });
    }

    /**
     * End the http server process
     */
    closeServer(){
        this.server.close();
    }

    /**
     * Enum definition for http methods
     */
    static get Method() {
        return {
            ALL: "all",
            GET: "get",
            POST: "post",
            PUT: "put",
            DELETE: "delete",
        };
    }

    /**
     * Create a new endpoint that shall listen and send dummy data
     * @param {DummyEndpointProvider.Method} method HTTP method
     * @param {*} path Endpoint path without prefix that might have been specified
     * @param {*} data Data to send on this endpoint
     * @return Endpoint object for further modification/ handling
     */
    createEndpoint(method, path, data) {
        let endpoint = new DummyEndpoint(
            this.app,
            method,
            this.prefix + path,
            data
        );

        if (!this.endpoints[path]) {
            this.endpoints[path] = {};
        }
        this.endpoints[path][method] = endpoint;

        return endpoint;
    }
}

class DummyEndpoint {
    /**
     * Create a new dummy endpoint.
     * Call "createEndpoint" on DummyEndpointProvider, rather than
     * instantiating this class yourself
     * @param {*} app Instance of running express app server
     * @param {*} method HTTP method to use
     * @param {*} path path to fulfill, e.g. "/api/v1/users"
     * @param {*} data Data to rsend
     */
    constructor(app, method, path, data) {
        this.method = method;
        this.path = path;
        this.data = data;

        let appCallback = (req, res) => {
            return res.send(this.data);
        };

        switch (method) {
            case DummyEndpointProvider.Method.ALL:
                app.all(path, appCallback);
                break;
            case DummyEndpointProvider.Method.DELETE:
                app.delete(path, appCallback);
                break;
            case DummyEndpointProvider.Method.GET:
                app.get(path, appCallback);
                break;
            case DummyEndpointProvider.Method.POST:
                app.post(path, appCallback);
                break;
            case DummyEndpointProvider.Method.PUT:
                app.put(path, appCallback);
                break;
            default:
                throw new Error(
                    `[Test.DummyEndpoint] Invalid method requested: "${method}"`
                );
        }
    }
}

module.exports = {
    DummyEndpointProvider,
    DummyEndpoint,
};
