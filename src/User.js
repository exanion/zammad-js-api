/**
 * User object
 * @author Peter Kappelt
 */

const endpoints = require("./Endpoints");
const ApiError = require("./ApiError");
const Utility = require("./Utility");
const { Validators } = Utility;

class User {
    /**
     * Create a new user object
     * @param {*} id Unique user id
     * @param {*} firstname User's firstname
     * @param {*} lastname  User's lastname
     * @param {*} updatedAt Date of last user data update
     * @param {*} createdAt Date of user creation
     */
    constructor(id, firstname, lastname, updatedAt, createdAt) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    /**
     * Set mail address of the user
     * @param {*} email Mail address of user
     */
    setEmail(email) {
        this.email = email;
    }

    /**
     * Set a custom note associated with this user
     * @param {*} note Note for this user
     */
    setNote(note) {
        this.note = note;
    }

    /**
     * Set the organization associated with this user
     * @param {int} organizationId Id of organization
     * @param {string} organizationName Name of organization
     */
    setOrganization(organizationId, organizationName) {
        this.organizationId = organizationId;
        this.organizationName = organizationName;
    }

    /**
     * Create a new user object from the response received via API
     * @param {*} json Parsed json object
     */
    static fromApiObject(response) {
        //sanity check of api response
        ["id", "firstname", "lastname", "updated_at", "created_at"].forEach(
            (key) => {
                Utility.ObjectHasKeyOrUnexpectedResponse(response, key);
            }
        );

        let user = new User(
            response.id,
            response.firstname,
            response.lastname,
            response.updated_at,
            response.created_at
        );

        //optional fields available in User object
        if ("email" in response) {
            user.setEmail(response.email);
        }
        if ("note" in response) {
            user.setNote(response.note);
        }
        if ("organization" in response && "organization_id" in response) {
            user.setOrganization(
                response.orgnaization_id,
                response.organization
            );
        }

        return user;
    }

    /**
     * Serialize the current user object to an API valid json object
     */
    toApiObject() {
        let user = {};

        user.id = this.id;
        user.firstname = this.firstname;
        user.lastname = this.lastname;
        if (this.email) {
            user.email = this.email;
        }
        if (this.note) {
            user.note = this.note;
        }
        if (this.organizationId && this.organizationName) {
            user.orgnaization_id = this.organizationId;
            user.organization_name = this.organizationName;
        }

        return user;
    }

    /**
     * Gets the user that is currently authenticated for the API
     * @param {ZammadApi} api Initialized API object
     */
    static async getAuthenticated(api) {
        let response = await api.doGetCall(endpoints.USER_CURRENT);
        return User.fromApiObject(response);
    }

    /**
     * Gets all users that are available for the system (if sufficient permission),
     * only own account otherwise
     * @param {ZammadApi} api Initialized API object
     */
    static async getAll(api) {
        let response = await api.doGetCall(endpoints.USER_LIST);
        if (!Array.isArray(response)) {
            throw new ApiError.UnexpectedResponse(
                "Invalid response (not received array)",
                "array",
                typeof response
            );
        }

        let users = Array();
        response.forEach((obj) => {
            users.push(User.fromApiObject(obj));
        });

        return users;
    }

    /**
     * Get a user by its id
     * @param {ZammadApi} api Initialized API object
     * @param {number} userId ID of user to get
     */
    static async getById(api, userId) {
        userId = Validators.AssertInt(userId);
        let response = await api.doGetCall(endpoints.USER_SHOW + userId);
        return User.fromApiObject(response);
    }

    /**
     * Search for one or more users that match the given query
     * @param {ZammadApi} api Initialized API object
     * @param {string} query Query string
     */
    static async search(api, query) {
        let response = await api.doGetCallWithParams(endpoints.USER_SEARCH, {
            [endpoints.USER_SEARCH_QUERY]: query,
        });
        if (!Array.isArray(response)) {
            throw new ApiError.UnexpectedResponse(
                "Invalid response (not received array)",
                "array",
                typeof response
            );
        }

        let users = Array();
        response.forEach((obj) => {
            users.push(User.fromApiObject(obj));
        });

        return users;
    }

    /**
     * Create a new user
     * @param {ZammadApi} api Initialized API object
     * @param {object} opt user options
     * @param {string} opt.firstname Firstname of user
     * @param {string} opt.lastname Lastname of user
     * @param {string} opt.email (Optional) Email of user
     * @param {string} opt.organization  (Optional) Name of organization user belongs to
     * @todo data validation
     * @return User that was created
     */
    static async create(api, opt) {
        //build user object to send to api
        let user = {};

        if (!("firstname" in opt)) {
            throw new ApiError.InvalidRequest("firstname is required");
        }
        user.firstname = opt.firstname;

        if (!("lastname" in opt)) {
            throw new ApiError.InvalidRequest("lastname is required");
        }
        user.lastname = opt.lastname;

        //optional fields
        if ("email" in opt) {
            user.email = opt.email;
        }
        if ("organization" in opt) {
            user.organization = opt.organization;
        }

        let response = await api.doPostCall(endpoints.USER_CREATE, user);

        return User.fromApiObject(response);
    }

    /**
     * Push the changes of the current user
     * @param {ZammadApi} api Initialized API object
     * @todo fill response data in current object
     */
    async update(api) {
        let user = this.toApiObject();
        let response = await api.doPutCall(
            endpoints.USER_UPDATE + this.id,
            user
        );
    }

    /**
     * Delete the current user on remote
     * @param {ZammadApi} api Initialized API object
     */
    async delete(api) {
        await api.doDeleteCall(endpoints.USER_DELETE + this.id);
    }
}

module.exports = User;
