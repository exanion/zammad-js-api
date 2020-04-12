/**
 * User object
 * @author Peter Kappelt
 */

const endpoints = require("./Endpoints");

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
     * Create a new user object from the response received via API
     * @param {*} json Parsed json object
     * @todo Use custom errors
     */
    static fromApiObject(response) {
        //sanity check of api response
        if (!("id" in response)) {
            throw new Error("id attribute missing");
        }
        if (!("firstname" in response)) {
            throw new Error("firstname attribute missing");
        }
        if (!("lastname" in response)) {
            throw new Error("lastname attribute missing");
        }
        if (!("updated_at" in response)) {
            throw new Error("updated_at attribute missing");
        }
        if (!("created_at" in response)) {
            throw new Error("created_at attribute missing");
        }

        let user = new User(
            response.id,
            response.firstname,
            response.lastname,
            response.updated_at,
            response.created_at
        );

        if ("email" in response) {
            user.setEmail(response.email);
        }
        if ("note" in response) {
            user.setNote(response.note);
        }

        return user;
    }

    /**
     * Gets the user that is currently authenticated for the API
     * @param {ZammadApi} api Initialized API object
     */
    static async getAuthenticatedUser(api) {
        let response = await api.doGetCall(endpoints.USER_CURRENT);
        return User.fromApiObject(response);
    }

    /**
     * Gets all users that are available for the system (if sufficient permission),
     * only own account otherwise
     * @param {ZammadApi} api Initialized API object
     */
    static async getUsers(api) {
        let response = await api.doGetCall(endpoints.USER_LIST);
        if (!Array.isArray(response)) {
            throw new Error("Invalid response");
        }

        let users = Array();
        response.forEach((obj) => {
            users.push(User.fromApiObject(obj));
        });

        return users;
    }
}

module.exports = User;
