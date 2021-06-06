/**
 * @jest-environment node
 */

const { DummyEndpointProvider } = require("./utility/DummyEndpointProvider");
const DataSeeder = require("./utility/DataSeeder");

const ZammadApi = require("../src/ZammadApi");
const ApiError = require("../src/ApiError");
const TicketPriority = require("../src/TicketPriority");

let api;
let ep;

beforeAll(() => {
    ep = new DummyEndpointProvider("/api/v1");
    api = new ZammadApi(`http://localhost:${ep.port}`);
});

/**
 * Create a user json object with random data
 */
function createRandomTicketPriority() {
    const id = DataSeeder.randomId();
    const name = DataSeeder.randomString(10);
    const active = DataSeeder.randomBool();
    const note = DataSeeder.randomString(30);
    const updatedAt = DataSeeder.randomIsoTimestamp();
    const createdAt = DataSeeder.randomIsoTimestamp();

    return {
        id,
        name,
        active,
        note,
        updated_at: updatedAt,
        created_at: createdAt,
    };
}

/**
 * Check if api ticket state object matches parsed state
 * @param {object} apiTicket json state api object
 * @param {User} parsedTicket state parsed by the implementation
 */
function checkIfPrioMatchesParsed(apiPrio, parsedPrio) {
    expect(typeof parsedPrio).toBe("object");
    expect(typeof apiPrio).toBe("object");

    expect(parsedPrio.id).toBe(apiPrio.id);
    expect(parsedPrio.name).toBe(apiPrio.name);
    expect(parsedPrio.active).toBe(apiPrio.active);
    expect(parsedPrio.note).toBe(apiPrio.note);
    expect(parsedPrio.updatedAt).toBe(apiPrio.updated_at);
    expect(parsedPrio.createdAt).toBe(apiPrio.created_at);
}

test("ticket priority list get", async () => {
    let randomApiPrios = Array(Math.floor(Math.random() * 9) + 1);
    let requestMade = false;

    for (i = 0; i < randomApiPrios.length; i++) {
        randomApiPrios[i] = createRandomTicketPriority();
    }

    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/ticket_priorities",
        randomApiPrios,
        (req) => {
            requestMade = true;
        }
    );

    let response = await TicketPriority.getAll(api);
    let checkedObjects = 0;

    for (i = 0; i < response.length; i++) {
        //iterate over all users, search for matching json object
        randomApiPrios.forEach((obj) => {
            if (obj.id == response[i].id) {
                checkIfPrioMatchesParsed(obj, response[i]);
                checkedObjects++;
            }
        });
    }

    expect(checkedObjects).toBe(randomApiPrios.length);
    expect(requestMade).toBe(true);
});

test("show priority details", async () => {
    let prio = createRandomTicketPriority();
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/ticket_priorities/" + prio.id,
        prio,
        (req) => {
            requestMade = true;
        }
    );

    let response = await TicketPriority.getById(api, prio.id);

    checkIfPrioMatchesParsed(prio, response);
    expect(requestMade).toBe(true);
});

test("ticket priority create", () => {
    expect(TicketPriority.create()).rejects.toEqual(
        new ApiError.Unimplemented()
    );
});

test("ticket priority update", () => {
    expect(
        TicketPriority.fromApiObject(createRandomTicketPriority()).update()
    ).rejects.toEqual(new ApiError.Unimplemented());
});

test("ticket priority delete", () => {
    expect(
        TicketPriority.fromApiObject(createRandomTicketPriority()).delete()
    ).rejects.toEqual(new ApiError.Unimplemented());
});

afterAll(() => {
    ep.closeServer();
});
