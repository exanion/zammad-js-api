/**
 * Endpoint path definitions for Zammad REST api
 * @author Peter Kappelt
 */

module.exports = {
    PREFIX: "/api/v1",
    USER_CURRENT: "/users/me",
    USER_LIST: "/users",
    USER_SEARCH: "/users/search",
    USER_SEARCH_QUERY: "query",
    USER_SHOW: "/users/",
    USER_CREATE: "/users",
    USER_UPDATE: "/users/",
    USER_DELETE: "/users/",
    TICKET_LIST: "/tickets",
    TICKET_SEARCH: "/tickets/search",
    TICKET_SEARCH_QUERY: "query",
    TICKET_SHOW: "/tickets/",
    TICKET_CREATE: "/tickets",
    TICKET_UPDATE: "/tickets/",
    TICKET_DELETE: "/tickets/",
    TICKET_STATE_LIST: "/ticket_states",
    TICKET_STATE_SHOW: "/ticket_states/",
    TICKET_STATE_CREATE: "/ticket_states",
    TICKET_STATE_UPDATE: "/ticket_states/",
    TICKET_STATE_DELETE: "/ticket_states",
    TICKET_PRIORITY_LIST: "/ticket_priorities",
    TICKET_PRIORITY_SHOW: "/ticket_priorities/",
    TICKET_PRIORITY_CREATE: "/ticket_priorities",
    TICKET_PRIORITY_UPDATE: "/ticket_priorities/",
    TICKET_PRIORITY_DELETE: "/ticket_priorities",
    TICKET_ARTICLE_BY_TICKET: "/ticket_articles/by_ticket/",
    TICKET_ARTICLE_SHOW: "/ticket_articles/",
    TICKET_ARTICLE_CREATE: "/ticket_articles"
};
