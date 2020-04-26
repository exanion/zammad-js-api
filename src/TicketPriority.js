/**
 * TicketPriority object
 * @author Peter Kappelt
 */

const endpoints = require("./Endpoints");
const ApiError = require("./ApiError");
const Utility = require("./Utility");
const { Validators } = Utility;

class TicketPriority {
    /**
     * Create a new ticket priority object
     * @param {int} id Ticket Priority ID
     * @param {string} name Name of ticket priority
     * @param {boolean} active
     * @param {string} note
     * @param {string} updatedAt
     * @param {string} createdAt
     */
    constructor(id, name, active, note, updatedAt, createdAt) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.note = note;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    /**
     * Create a new ticket priorioty object from the response received via API
     * @param {*} json Parsed json object
     */
    static fromApiObject(response) {
        //sanity check of api response
        ["id", "name", "active", "note", "updated_at", "created_at"].forEach(
            (key) => {
                Utility.ObjectHasKeyOrUnexpectedResponse(response, key);
            }
        );

        let tprio = new TicketPriority(
            response.id,
            response.name,
            response.active,
            response.note,
            response.updated_at,
            response.created_at
        );

        return tprio;
    }

    /**
     * Serialize the current ticket priority object to an API valid json object
     */
    toApiObject() {
        let tprio = {};

        tprio.id = this.id;
        tprio.name = this.name;
        tprio.active = this.active;
        tprio.note = this.note;

        return tprio;
    }

    /**
     * Gets all ticket priorities the instance supports
     * @param {ZammadApi} api Initialized API object
     */
    static async getAll(api) {
        let response = await api.doGetCall(endpoints.TICKET_PRIORITY_LIST);
        if (!Array.isArray(response)) {
            throw new ApiError.UnexpectedResponse(
                "Invalid response (not received array)",
                "array",
                typeof response
            );
        }

        let tprios = Array();
        response.forEach((obj) => {
            tprios.push(TicketPriority.fromApiObject(obj));
        });

        return tprios;
    }

    /**
     * Get a ticket priority by its id
     * @param {ZammadApi} api Initialized API object
     * @param {number} tprioId id of priority to get
     * @todo implementation
     */
    static async getById(api, tprioId) {
        tprioId = Validators.AssertInt(tprioId);
        let response = await api.doGetCall(
            endpoints.TICKET_PRIORITY_SHOW + tprioId
        );
        return TicketPriority.fromApiObject(response);
    }

    /**
     * Create a new ticket priority
     * @param {ZammadApi} api Initialized API object
     * @param {object} opt priority options
     * @param {string} opt.name State Name
     * @param {boolean} opt.active
     * @param {string|null} opt.note
     * @todo implementation
     * @return User that was created
     */
    static async create(api, opt) {
        throw new ApiError.Unimplemented();
    }

    /**
     * Push the changes of the current priority
     * @param {ZammadApi} api Initialized API object
     * @todo implement
     */
    async update(api) {
        throw new ApiError.Unimplemented();
    }

    /**
     * Delete the current priority on remote
     * @param {ZammadApi} api Initialized API object
     * @todo implement
     */
    async delete(api) {
        throw new ApiError.Unimplemented();
    }
}

module.exports = TicketPriority;
