/**
 * TicketState object
 * @author Peter Kappelt
 */

const endpoints = require("./Endpoints");
const ApiError = require("./ApiError");
const Utility = require("./Utility");
const { Validators } = Utility;

class TicketState {
    /**
     * Create a new ticket state object
     * @param {int} id Ticket State ID
     * @param {string} name Name of ticket state
     * @param {int} stateTypeId
     * @param {int} nextStateId
     * @param {boolean} ignoreEscalation
     * @param {boolean} active
     * @param {string} note
     * @param {string} updatedAt
     * @param {string} createdAt
     */
    constructor(
        id,
        name,
        stateTypeId,
        nextStateId,
        ignoreEscalation,
        active,
        note,
        updatedAt,
        createdAt
    ) {
        this.id = id;
        this.name = name;
        this.stateTypeId = stateTypeId;
        this.nextStateId = nextStateId;
        this.ignoreEscalation = ignoreEscalation;
        this.active = active;
        this.note = note;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    /**
     * Create a new ticket state object from the response received via API
     * @param {*} json Parsed json object
     */
    static fromApiObject(response) {
        //sanity check of api response
        [
            "id",
            "name",
            "state_type_id",
            "next_state_id",
            "ignore_escalation",
            "active",
            "note",
            "updated_at",
            "created_at",
        ].forEach((key) => {
            Utility.ObjectHasKeyOrUnexpectedResponse(response, key);
        });

        let tstate = new TicketState(
            response.id,
            response.name,
            response.state_type_id,
            response.next_state_id,
            response.ignore_escalation,
            response.active,
            response.note,
            response.updated_at,
            response.created_at
        );

        return tstate;
    }

    /**
     * Serialize the current ticket state object to an API valid json object
     */
    toApiObject() {
        let tstate = {};

        tstate.id = this.id;
        tstate.name = this.name;
        tstate.state_type_id = this.stateTypeId;
        tstate.next_state_id = this.nextStateId;
        tstate.ignore_escalation = this.ignoreEscalation;
        tstate.active = this.active;
        tstate.note = this.note;

        return tstate;
    }

    /**
     * Gets all ticket states the instance supports
     * @param {ZammadApi} api Initialized API object
     */
    static async getAll(api) {
        let response = await api.doGetCall(endpoints.TICKET_STATE_LIST);
        if (!Array.isArray(response)) {
            throw new ApiError.UnexpectedResponse(
                "Invalid response (not received array)",
                "array",
                typeof response
            );
        }

        let tstates = Array();
        response.forEach((obj) => {
            tstates.push(TicketState.fromApiObject(obj));
        });

        return tstates;
    }

    /**
     * Get a ticket state by its id
     * @param {ZammadApi} api Initialized API object
     * @param {number} tstateId id of state to get
     * @todo implementation
     */
    static async getById(api, tstateId) {
        tstateId = Validators.AssertInt(tstateId);
        let response = await api.doGetCall(
            endpoints.TICKET_STATE_SHOW + tstateId
        );
        return TicketState.fromApiObject(response);
    }

    /**
     * Create a new ticket state
     * @param {ZammadApi} api Initialized API object
     * @param {object} opt state options
     * @param {string} opt.name State Name
     * @param {int} opt.stateTypeId
     * @param {int|null} opt.nextStateId
     * @param {boolean} opt.ignoreEscalation
     * @param {boolean} opt.active
     * @param {string|null} opt.note
     * @todo implementation
     * @return User that was created
     */
    static async create(api, opt) {
        throw new ApiError.Unimplemented();
    }

    /**
     * Push the changes of the current state
     * @param {ZammadApi} api Initialized API object
     * @todo implement
     */
    async update(api) {
        throw new ApiError.Unimplemented();
    }

    /**
     * Delete the current state on remote
     * @param {ZammadApi} api Initialized API object
     * @todo implement
     */
    async delete(api) {
        throw new ApiError.Unimplemented();
    }
}

module.exports = TicketState;
