/**
 * Ticket object
 * @author Peter Kappelt
 */

const endpoints = require("./Endpoints");
const ApiError = require("./ApiError");
const User = require("./User");
const TicketState = require("./TicketState");
const TicketPriority = require("./TicketPriority");
const TicketArticle = require("./TicketArticle");
const Utility = require("./Utility");
const { Validators } = Utility;

class Ticket {
    /**
     * Create new ticket object
     * @param {int} id Ticket object id
     * @param {string} number System ticket number
     * @param {string} title Ticket title
     * @param {int} groupId id of the group the ticket belongs to
     * @param {int} stateId id of the ticket's state
     * @param {in} priorityId id of the ticket's priority
     * @param {int} customerId id of the customer the ticket belongs to
     * @param {string|null} note Note for the ticket
     * @param {string} updatedAt Updated at timestamp
     * @param {string} createdAt Created at timestamp
     */
    constructor(
        id,
        title,
        number,
        groupId,
        stateId,
        priorityId,
        customerId,
        note,
        updatedAt,
        createdAt
    ) {
        this.id = id;
        this.title = title;
        this.number = number;
        this.groupId = groupId;
        this.stateId = stateId;
        this.priorityId = priorityId;
        this.customerId = customerId;
        this.note = note;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    /**
     * Create a new ticket object from the response received via API
     * @param {*} json Parsed json object
     */
    static fromApiObject(response) {
        //sanity check of api response
        [
            "id",
            "title",
            "number",
            "group_id",
            "state_id",
            "priority_id",
            "customer_id",
            "note",
            "updated_at",
            "created_at",
        ].forEach((key) => {
            Utility.ObjectHasKeyOrUnexpectedResponse(response, key);
        });

        let ticket = new Ticket(
            response.id,
            response.title,
            response.number,
            response.group_id,
            response.state_id,
            response.priority_id,
            response.customer_id,
            response.note,
            response.updated_at,
            response.created_at
        );

        return ticket;
    }

    /**
     * Serialize the current ticket object to an API valid json object
     */
    toApiObject() {
        let ticket = {};

        ticket.id = this.id;
        ticket.title = this.title;
        ticket.number = this.number;
        ticket.group_id = this.groupId;
        ticket.state_id = this.stateId;
        ticket.priority_id = this.priorityId;
        ticket.customer_id = this.customerId;
        ticket.note = this.note;

        return ticket;
    }

    /**
     * Gets all tickets that the authenticated user can view
     * @param {ZammadApi} api Initialized API object
     */
    static async getAll(api) {
        let response = await api.doGetCall(endpoints.TICKET_LIST);
        if (!Array.isArray(response)) {
            throw new ApiError.UnexpectedResponse(
                "Invalid response (not received array)",
                "array",
                typeof response
            );
        }

        let tickets = Array();
        response.forEach((obj) => {
            tickets.push(Ticket.fromApiObject(obj));
        });

        return tickets;
    }

    /**
     * Get a ticket by its id
     * @param {ZammadApi} api Initialized API object
     * @param {number} ticketId of ticket to get
     */
    static async getById(api, ticketId) {
        ticketId = Validators.AssertInt(ticketId);
        let response = await api.doGetCall(endpoints.TICKET_SHOW + ticketId);
        return Ticket.fromApiObject(response);
    }

    /**
     * Search for one or more tickets that match the given query
     * @param {ZammadApi} api Initialized API object
     * @param {string} query Query string
     */
    static async search(api, query) {
        let response = await api.doGetCallWithParams(endpoints.TICKET_SEARCH, {
            [endpoints.TICKET_SEARCH_QUERY]: query,
        });
        if (!Array.isArray(response)) {
            throw new ApiError.UnexpectedResponse(
                "Invalid response (not received array)",
                "array",
                typeof response
            );
        }

        let tickets = Array();
        response.forEach((obj) => {
            tickets.push(Ticket.fromApiObject(obj));
        });

        return tickets;
    }

    /**
     * Create a new ticket
     * @param {ZammadApi} api Initialized API object
     * @param {object} opt ticket options
     * @param {string} opt.title Ticket title
     * @param {int} opt.groupId Group Id for ticket
     * @param {int} opt.customerId Customer Id for ticket
     * @param {string} opt.articleBody Body of article to add (defautlt non-internal note)
     * @param {string} opt.articleSubject (Optional) Subject of ticket article, default null
     * @param {string} opt.articleType (Optional) Type of first article to add, default note
     * @param {boolean} opt.articleInternal (Optional) Set the internal attribute for the article, default false
     * @todo data validation
     * @return Ticket that was created
     */
    static async create(api, opt) {
        //build ticket object to send to api
        let ticket = {};

        if (!("title" in opt)) {
            throw new ApiError.InvalidRequest("title is required");
        }
        ticket.title = opt.title;

        if (!("groupId" in opt)) {
            throw new ApiError.InvalidRequest("groupId is required");
        }
        ticket.group_id = opt.groupId;

        if (!("customerId" in opt)) {
            throw new ApiError.InvalidRequest("customerId is required");
        }
        ticket.customer_id = opt.customerId;

        if (!("articleBody" in opt)) {
            throw new ApiError.InvalidRequest("articleBody is required");
        }
        ticket.article = { body: opt.articleBody };

        //optional fields
        if ("articleSubject" in opt) {
            ticket.article.subject = opt.articleSubject;
        }
        if ("articleType" in opt) {
            ticket.article.type = opt.articleType;
        }
        if ("articleInternal" in opt) {
            ticket.article.internal = opt.articleInternal ? true : false;
        }

        let response = await api.doPostCall(endpoints.TICKET_CREATE, ticket);

        return Ticket.fromApiObject(response);
    }

    /**
     * Push the changes of the current ticket
     * @param {ZammadApi} api Initialized API object
     * @todo fill response data in current object
     */
    async update(api) {
        let ticket = this.toApiObject();
        let response = await api.doPutCall(
            endpoints.TICKET_UPDATE + this.id,
            ticket
        );
    }

    /**
     * Delete the current ticket on remote
     * @param {ZammadApi} api Initialized API object
     */
    async delete(api) {
        await api.doDeleteCall(endpoints.TICKET_DELETE + this.id);
    }

    /**
     * Return the customer the ticket belongs to
     * @param {ZammadApi} api Initialized API object
     * @returns {User} Customer this ticket belongs to
     */
    async customer(api) {
        if (this.customerId) {
            return await User.getById(api, this.customerId);
        } else {
            return null;
        }
    }

    /**
     * Return the priority for this ticket
     * @param {ZammadApi} api Initialized API object
     * @returns {TicketPriority} priority of this ticket
     */
    async priority(api) {
        if (this.priorityId) {
            return await TicketPriority.getById(api, this.priorityId);
        } else {
            return null;
        }
    }

    /**
     * Return the state of this ticket
     * @param {ZammadApi} api Initialized API object
     * @returns {TicketState} current state of the ticket
     */
    async state(api) {
        if (this.stateId) {
            return await TicketState.getById(api, this.stateId);
        } else {
            return null;
        }
    }

    /**
     * Return all articles (messages, notes etc) that belong to this tickets
     * @param {ZammadApi} api Initialized API object
     * @returns {TicketArticle[]} All articles for this ticket
     */
    async articles(api){
        return await TicketArticles.getForTicket(api, this.id);
    }
}

module.exports = Ticket;
