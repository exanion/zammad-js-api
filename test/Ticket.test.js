/**
 * @jest-environment node
 */

const { DummyEndpointProvider } = require("./utility/DummyEndpointProvider");
const DataSeeder = require("./utility/DataSeeder");

const ZammadApi = require("../src/ZammadApi");
const Ticket = require("../src/Ticket");

let api;
let ep;

beforeAll(() => {
    ep = new DummyEndpointProvider("/api/v1");
    api = new ZammadApi(`http://localhost:${ep.port}`);
});

/**
 * Create a user json object with random data
 */
function createRandomTicket() {
    const id = DataSeeder.randomId();
    const group_id = DataSeeder.randomId();
    const priority_id = DataSeeder.randomId();
    const state_id = DataSeeder.randomId();
    const number = DataSeeder.randomString(5);
    const title = DataSeeder.randomString(20);
    const customer_id = DataSeeder.randomId();
    const owner_id = DataSeeder.randomId();
    const note = DataSeeder.randomString(50);
    const updatedAt = DataSeeder.randomIsoTimestamp();
    const createdAt = DataSeeder.randomIsoTimestamp();

    return {
        id,
        group_id,
        priority_id,
        state_id,
        number,
        title,
        customer_id,
        owner_id,
        note,
        updated_at: updatedAt,
        created_at: createdAt,
    };
}

/**
 * Check if api ticket object matches parsed ticket
 * @param {object} apiTicket json ticket api object
 * @param {User} parsedTicket ticket parsed by the implementation
 */
function checkIfApiTicketMatchesParsed(apiTicket, parsedTicket) {
    expect(typeof parsedTicket).toBe("object");
    expect(typeof apiTicket).toBe("object");

    expect(parsedTicket.id).toBe(apiTicket.id);
    expect(parsedTicket.groupId).toBe(apiTicket.group_id);
    expect(parsedTicket.priorityId).toBe(apiTicket.priority_id);
    expect(parsedTicket.stateId).toBe(apiTicket.state_id);
    expect(parsedTicket.number).toBe(apiTicket.number);
    expect(parsedTicket.title).toBe(apiTicket.title);
    expect(parsedTicket.customerId).toBe(apiTicket.customer_id);
    expect(parsedTicket.ownerId).toBe(apiTicket.owner_id);
    expect(parsedTicket.note).toBe(apiTicket.note);
    expect(parsedTicket.updatedAt).toBe(apiTicket.updated_at);
    expect(parsedTicket.createdAt).toBe(apiTicket.created_at);
}

test("ticket list get", async () => {
    let randomApiTickets = Array(Math.floor(Math.random() * 9) + 1);
    let requestMade = false;

    for (i = 0; i < randomApiTickets.length; i++) {
        randomApiTickets[i] = createRandomTicket();
    }
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/tickets",
        randomApiTickets,
        (req) => {
            requestMade = true;
        }
    );

    let response = await Ticket.getAll(api);
    let checkedObjects = 0;

    for (i = 0; i < response.length; i++) {
        //iterate over all users, search for matching json object
        randomApiTickets.forEach((obj) => {
            if (obj.id == response[i].id) {
                checkIfApiTicketMatchesParsed(obj, response[i]);
                checkedObjects++;
            }
        });
    }

    expect(checkedObjects).toBe(randomApiTickets.length);
    expect(requestMade).toBe(true);
});

test("ticket search", async () => {
    let queryString = DataSeeder.randomString(10);
    let requestMade = false;

    let randomApiTickets = Array(Math.floor(Math.random() * 9) + 1);
    for (i = 0; i < randomApiTickets.length; i++) {
        randomApiTickets[i] = createRandomTicket();
    }
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/tickets/search",
        randomApiTickets,
        async (req) => {
            //expect to have query string that matches
            expect(req.query).toHaveProperty("query", queryString);
            requestMade = true;
        }
    );

    let response = await Ticket.search(api, queryString);
    let checkedObjects = 0;

    for (i = 0; i < response.length; i++) {
        //iterate over all users, search for matching json object
        randomApiTickets.forEach((obj) => {
            if (obj.id == response[i].id) {
                checkIfApiTicketMatchesParsed(obj, response[i]);
                checkedObjects++;
            }
        });
    }

    expect(checkedObjects).toBe(randomApiTickets.length);
    expect(requestMade).toBe(true);
});

test("show ticket details", async () => {
    let ticket = createRandomTicket();
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/tickets/" + ticket.id,
        ticket,
        (req) => {
            requestMade = true;
        }
    );

    let response = await Ticket.getById(api, ticket.id);

    checkIfApiTicketMatchesParsed(ticket, response);
    expect(requestMade).toBe(true);
});

test("ticket create", async () => {
    let plainTicket = createRandomTicket();
    plainTicket.article = {
        body: DataSeeder.randomString(30),
    };
    let ticket;
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.POST,
        "/tickets",
        plainTicket,
        async (req) => {
            expect(req.body.title).toBe(plainTicket.title);
            expect(req.body.group_id).toBe(plainTicket.group_id);
            expect(req.body.customer_id).toBe(plainTicket.customer_id);
            expect(req.body.owner_id).toBe(plainTicket.owner_id);
            expect(typeof req.body.article).toBe("object");
            expect(req.body.article.body).toBe(plainTicket.article.body);
            requestMade = true;
        }
    );

    ticket = await Ticket.create(api, {
        title: plainTicket.title,
        groupId: plainTicket.group_id,
        customerId: plainTicket.customer_id,
        ownerId: plainTicket.owner_id,
        articleBody: plainTicket.article.body,
    });

    checkIfApiTicketMatchesParsed(plainTicket, ticket);
    expect(requestMade).toBe(true);
});

test("ticket update", async () => {
    let plainTicket = createRandomTicket();
    let ticket = Ticket.fromApiObject(plainTicket);
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.PUT,
        "/tickets/" + plainTicket.id,
        plainTicket,
        async (req) => {
            checkIfApiTicketMatchesParsed(ticket, req.body);
            requestMade = true;
        }
    );

    await ticket.update(api);
    expect(requestMade).toBe(true);
});

test("ticket delete", async () => {
    let plainTicket = createRandomTicket();
    let ticket = Ticket.fromApiObject(plainTicket);
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.DELETE,
        "/tickets/" + plainTicket.id,
        {},
        (req) => {
            requestMade = true;
        }
    );
    await ticket.delete(api);
    expect(requestMade).toBe(true);
});

afterAll(() => {
    ep.closeServer();
});
