/**
 * @jest-environment node
 */

const { DummyEndpointProvider } = require("./utility/DummyEndpointProvider");
const DataSeeder = require("./utility/DataSeeder");

const ZammadApi = require("../src/ZammadApi");
const User = require("../src/User");

let api;
let ep;

beforeAll(() => {
    ep = new DummyEndpointProvider("/api/v1");
    api = new ZammadApi(`http://localhost:${ep.port}`);
});

/**
 * Create a user json object with random data
 */
function createRandomUser() {
    const id = DataSeeder.randomId();
    const firstname = DataSeeder.randomName();
    const lastname = DataSeeder.randomName();
    const email = DataSeeder.randomMail();
    const note = DataSeeder.randomString(30);
    const updatedAt = DataSeeder.randomIsoTimestamp();
    const createdAt = DataSeeder.randomIsoTimestamp();

    return {
        id,
        firstname,
        lastname,
        email,
        note,
        updated_at: updatedAt,
        created_at: createdAt,
    };
}

/**
 * Check if api user object matches parsed user
 * @param {object} apiUser json user api object
 * @param {User} parsedUser user parsed by the implementation
 */
function checkIfApiUserMatchesParsed(apiUser, parsedUser) {
    expect(typeof parsedUser).toBe("object");
    expect(typeof apiUser).toBe("object");

    expect(parsedUser.id).toBe(apiUser.id);
    expect(parsedUser.firstname).toBe(apiUser.firstname);
    expect(parsedUser.lastname).toBe(apiUser.lastname);
    expect(parsedUser.email).toBe(apiUser.email);
    expect(parsedUser.note).toBe(apiUser.note);
    expect(parsedUser.updatedAt).toBe(apiUser.updated_at);
    expect(parsedUser.createdAt).toBe(apiUser.created_at);
}

test("authenticated user get", async () => {
    let randomApiUser = createRandomUser();
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/users/me",
        randomApiUser,
        (req) => {
            requestMade = true;
        }
    );

    let response = await User.getAuthenticated(api);

    checkIfApiUserMatchesParsed(randomApiUser, response);
    expect(requestMade).toBe(true);
});

test("user list get", async () => {
    let randomApiUsers = Array(Math.floor(Math.random() * 9) + 1);
    let requestMade = false;

    for (i = 0; i < randomApiUsers.length; i++) {
        randomApiUsers[i] = createRandomUser();
    }

    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/users",
        randomApiUsers,
        (req) => {
            requestMade = true;
        }
    );

    let response = await User.getAll(api);
    let checkedObjects = 0;

    for (i = 0; i < response.length; i++) {
        //iterate over all users, search for matching json object
        randomApiUsers.forEach((obj) => {
            if (obj.id == response[i].id) {
                checkIfApiUserMatchesParsed(obj, response[i]);
                checkedObjects++;
            }
        });
    }

    expect(checkedObjects).toBe(randomApiUsers.length);
    expect(requestMade).toBe(true);
});

test("user search", async () => {
    let queryString = DataSeeder.randomString(10);
    let requestMade = false;
    let randomApiUsers = Array(Math.floor(Math.random() * 9) + 1);

    for (i = 0; i < randomApiUsers.length; i++) {
        randomApiUsers[i] = createRandomUser();
    }
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/users/search",
        randomApiUsers,
        async (req) => {
            //expect to have query string that matches
            expect(req.query).toHaveProperty("query", queryString);
            requestMade = true;
        }
    );

    let response = await User.search(api, queryString);
    let checkedObjects = 0;

    for (i = 0; i < response.length; i++) {
        //iterate over all users, search for matching json object
        randomApiUsers.forEach((obj) => {
            if (obj.id == response[i].id) {
                checkIfApiUserMatchesParsed(obj, response[i]);
                checkedObjects++;
            }
        });
    }

    expect(checkedObjects).toBe(randomApiUsers.length);
    expect(requestMade).toBe(true);
});

test("show user details", async () => {
    let user = createRandomUser();
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/users/" + user.id,
        user,
        (req) => {
            requestMade = true;
        }
    );

    let response = await User.getById(api, user.id);

    checkIfApiUserMatchesParsed(user, response);
    expect(requestMade).toBe(true);
});

test("user create", async () => {
    let plainUser = createRandomUser();
    let requestMade = false;
    let user;

    ep.createEndpoint(
        DummyEndpointProvider.Method.POST,
        "/users",
        plainUser,
        async (req) => {
            expect(req.body.firstname).toBe(plainUser.firstname);
            expect(req.body.lastname).toBe(plainUser.lastname);
            expect(req.body.email).toBe(plainUser.email);
            requestMade = true;
        }
    );

    user = await User.create(api, {
        firstname: plainUser.firstname,
        lastname: plainUser.lastname,
        email: plainUser.email,
    });

    checkIfApiUserMatchesParsed(plainUser, user);
    expect(requestMade).toBe(true);
});

test("user update", async () => {
    let plainUser = createRandomUser();
    let user = User.fromApiObject(plainUser);
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.PUT,
        "/users/" + plainUser.id,
        plainUser,
        async (req) => {
            checkIfApiUserMatchesParsed(user, req.body);
            requestMade = true;
        }
    );

    await user.update(api);
    expect(requestMade).toBe(true);
});

test("user delete", async () => {
    let plainUser = createRandomUser();
    let user = User.fromApiObject(plainUser);
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.DELETE,
        "/users/" + plainUser.id,
        {},
        (req) => {
            requestMade = true;
        }
    );
    await user.delete(api);
    expect(requestMade).toBe(true);
});

afterAll(() => {
    ep.closeServer();
});
