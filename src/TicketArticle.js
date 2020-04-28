/**
 * Ticket article object
 * @author Peter Kappelt
 */

const endpoints = require("./Endpoints");
const ApiError = require("./ApiError");
const Ticket = require("./TicketState");
const Utility = require("./Utility");
const { Validators } = Utility;

class TicketArticle {
    /**
     * Create a new ticket article object
     * @param {int} id Ticket article id
     * @param {int} ticketId Id of the ticket this article belongs to
     * @param {int} senderId Id of the user who sent this article
     * @param {string|null} subject subject of the article
     * @param {string} body Body of the article
     * @param {string} contentType MIME type of the body, usually "text/plain"
     * @param {boolean} internal Internal flag
     * @param {string} type Type of the created article, e.g. "phone", "mail"
     * @param {string} sender Sender of article, e.g. "Agent", "System", "Customer"
     * @param {int} createdById Created by ID
     * @param {int} updatedById Updated by ID
     * @param {string} updatedAt Updated at timestamp
     * @param {string} createdAt Created at timestamp
     */
    constructor(
        id,
        ticketId,
        senderId,
        subject,
        body,
        contentType,
        internal,
        type,
        sender,
        createdById,
        updatedById,
        updatedAt,
        createdAt
    ) {
        this.id = id;
        this.ticketId = ticketId;
        this.senderId = senderId;
        this.subject = subject;
        this.body = body;
        this.contentType = contentType;
        this.internal = internal;
        this.type = type;
        this.sender = sender;
        this.createdById = createdById;
        this.updatedById = updatedById;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    /**
     * Create a new ticket article object from the response received via API
     * @param {*} json Parsed json object
     */
    static fromApiObject(response) {
        //sanity check of api response
        [
            "id",
            "ticket_id",
            "sender_id",
            "subject",
            "body",
            "content_type",
            "internal",
            "type",
            "sender",
            "created_by_id",
            "updated_by_id",
            "created_at",
            "updated_at",
        ].forEach((key) => {
            Utility.ObjectHasKeyOrUnexpectedResponse(response, key);
        });

        let article = new TicketArticle(
            response.id,
            response.ticket_id,
            response.sender_id,
            response.subject,
            response.body,
            response.content_type,
            response.internal,
            response.type,
            response.sender,
            response.created_by_id,
            response.updated_by_id,
            response.updated_at,
            response.created_at
        );

        return article;
    }

    /**
     * Gets all articles that belong to a ticket
     * @param {ZammadApi} api Initialized API object
     * @param {int} ticketId Id of the ticket to query
     */
    static async getForTicket(api, ticketId) {
        let response = await api.doGetCall(
            endpoints.TICKET_ARTICLE_BY_TICKET + ticketId
        );
        if (!Array.isArray(response)) {
            throw new ApiError.UnexpectedResponse(
                "Invalid response (not received array)",
                "array",
                typeof response
            );
        }

        let articles = Array();
        response.forEach((obj) => {
            articles.push(TicketArticle.fromApiObject(obj));
        });

        return articles;
    }

    /**
     * Get a ticket article by its id
     * @param {ZammadApi} api Initialized API object
     * @param {number} articleId id of article to get
     */
    static async getById(api, articleId) {
        articleId = Validators.AssertInt(articleId);
        let response = await api.doGetCall(
            endpoints.TICKET_ARTICLE_SHOW + articleId
        );
        return TicketArticle.fromApiObject(response);
    }

    /**
     * Create a new ticket article
     * @param {ZammadApi} api Initialized API object
     * @param {object} opt article options
     * @param {string} opt.body article body content
     * @param {string|null} opt.subject (Optional) subject of article
     * @param {string|null} opt.contentType (Optional) content type of body
     * @param {boolean} opt.internal (Optional) internal flag for the article, default false
     * @param {string} opt.type (Optional) type for the article, default "note"
     * @todo data validation
     * @return Ticket article that was created
     */
    static async create(api, opt) {
        //build article object to send to api
        let article = {};

        if (!("body" in opt)) {
            throw new ApiError.InvalidRequest("body is required");
        }
        article.body = opt.body;

        //optional fields
        if ("subject" in opt) {
            article.subject = opt.subject;
        }
        if ("contentType" in opt) {
            article.content_type = opt.contentType;
        }
        if ("internal" in opt) {
            article.internal = opt.internal ? true : false;
        }
        if ("type" in opt) {
            article.type = opt.type;
        }

        let response = await api.doPostCall(
            endpoints.TICKET_ARTICLE_CREATE,
            article
        );

        return TicketArticle.fromApiObject(response);
    }

    /**
     * Return the sender who created this article
     * @param {ZammadApi} api Initialized API object
     * @returns {User} Sender of the ticket
     */
    async sender(api) {
        if (this.customerId) {
            return await User.getById(api, this.customerId);
        } else {
            return null;
        }
    }

    /**
     * Get the ticket this article belongs to
     * @param {ZammadApi} api Initialized API object
     * @returns {Ticket} ticket
     */
    async ticket(api) {
        if (this.ticketId) {
            return await Ticket.getById(api, this.ticketId);
        } else {
            return null;
        }
    }
}

module.exports = TicketArticle;
