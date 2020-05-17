/**
 * @jest-environment node
 */

const { DummyEndpointProvider } = require("./utility/DummyEndpointProvider");
const DataSeeder = require("./utility/DataSeeder");

const ZammadApi = require("../src/ZammadApi");
const ApiError = require("../src/ApiError");
const TicketState = require("../src/TicketState");

let api;
let ep;

beforeAll(() => {
    ep = new DummyEndpointProvider("/api/v1");
    api = new ZammadApi(`http://localhost:${ep.port}`);
});

/**
 * Create a user json object with random data
 */
function createRandomTicketState() {
    const id = DataSeeder.randomId();
    const name = DataSeeder.randomString(10);
    const state_type_id = DataSeeder.randomId();
    const next_state_id = DataSeeder.randomId();
    const ignore_escalation = DataSeeder.randomBool();
    const active = DataSeeder.randomBool();
    const note = DataSeeder.randomString(30);
    const updatedAt = DataSeeder.randomIsoTimestamp();
    const createdAt = DataSeeder.randomIsoTimestamp();

    return {
        id,
        name,
        state_type_id,
        next_state_id,
        ignore_escalation,
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
function checkIfStateMatchesParsed(apiState, parsedState) {
    expect(typeof parsedState).toBe("object");
    expect(typeof apiState).toBe("object");

    expect(parsedState.id).toBe(apiState.id);
    expect(parsedState.name).toBe(apiState.name);
    expect(parsedState.stateTypeId).toBe(apiState.state_type_id);
    expect(parsedState.nextStateId).toBe(apiState.next_state_id);
    expect(parsedState.ignoreEscalation).toBe(apiState.ignore_escalation);
    expect(parsedState.active).toBe(apiState.active);
    expect(parsedState.note).toBe(apiState.note);
    expect(parsedState.updatedAt).toBe(apiState.updated_at);
    expect(parsedState.createdAt).toBe(apiState.created_at);
}

test("ticket state list get", async (done) => {
    let randomApiStates = Array(Math.floor(Math.random() * 9) + 1);
    for (i = 0; i < randomApiStates.length; i++) {
        randomApiStates[i] = createRandomTicketState();
    }
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/ticket_states",
        randomApiStates,
        (req) => {
            done();
        }
    );

    let response = await TicketState.getAll(api);
    let checkedObjects = 0;

    for (i = 0; i < response.length; i++) {
        //iterate over all users, search for matching json object
        randomApiStates.forEach((obj) => {
            if (obj.id == response[i].id) {
                checkIfStateMatchesParsed(obj, response[i]);
                checkedObjects++;
            }
        });
    }

    expect(checkedObjects).toBe(randomApiStates.length);
});

test("show state details", async (done) => {
    let state = createRandomTicketState();
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/ticket_states/" + state.id,
        state,
        (req) => {
            done();
        }
    );

    let response = await TicketState.getById(api, state.id);

    checkIfStateMatchesParsed(state, response);
});

test("ticket state create", () => {
    expect(TicketState.create()).rejects.toEqual(new ApiError.Unimplemented());
});

test("ticket state update", () => {
    expect(
        TicketState.fromApiObject(createRandomTicketState()).update()
    ).rejects.toEqual(new ApiError.Unimplemented());
});

test("ticket state delete", () => {
    expect(
        TicketState.fromApiObject(createRandomTicketState()).delete()
    ).rejects.toEqual(new ApiError.Unimplemented());
});

afterAll(() => {
    ep.closeServer();
});
