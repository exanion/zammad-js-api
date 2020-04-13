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
    ep = new DummyEndpointProvider(3000, "/api/v1");
    api = new ZammadApi("http://localhost:3000");
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
    expect(parsedUser.id).toBe(apiUser.id);
    expect(parsedUser.firstname).toBe(apiUser.firstname);
    expect(parsedUser.lastname).toBe(apiUser.lastname);
    expect(parsedUser.email).toBe(apiUser.email);
    expect(parsedUser.note).toBe(apiUser.note);
    expect(parsedUser.updatedAt).toBe(apiUser.updated_at);
    expect(parsedUser.createdAt).toBe(apiUser.created_at);
}

test("authenticated user get", async (done) => {
    let randomApiUser = createRandomUser();
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/users/me",
        randomApiUser,
        (req) => {
            done();
        }
    );

    let response = await User.getAuthenticatedUser(api);

    checkIfApiUserMatchesParsed(randomApiUser, response);
});

test("user list get", async (done) => {
    let randomApiUsers = Array(Math.floor(Math.random() * 9) + 1);
    for (i = 0; i < randomApiUsers.length; i++) {
        randomApiUsers[i] = createRandomUser();
    }
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/users",
        randomApiUsers,
        (req) => {
            done();
        }
    );

    let response = await User.getUsers(api);
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
});

test("user search", async (done) => {
    let queryString = DataSeeder.randomString(10);

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
            done();
        }
    );

    let response = await User.searchUser(api, queryString);
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
});

test("show user details", async (done) => {
    let user = createRandomUser();
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/users/" + user.id,
        user,
        (req) => {
            done();
        }
    );

    let response = await User.getUser(api, user.id);

    checkIfApiUserMatchesParsed(user, response);
});

test("user create", async (done) => {
    let plainUser = createRandomUser();
    let user;

    ep.createEndpoint(
        DummyEndpointProvider.Method.POST,
        "/users",
        plainUser,
        async (req) => {
            expect(req.body.firstname).toBe(plainUser.firstname);
            expect(req.body.lastname).toBe(plainUser.lastname);
            expect(req.body.email).toBe(plainUser.email);
            done();
        }
    );

    user = await User.createUser(api, {
        firstname: plainUser.firstname,
        lastname: plainUser.lastname,
        email: plainUser.email,
    });

    checkIfApiUserMatchesParsed(plainUser, user);
});

test("user update", async (done) => {
    let plainUser = createRandomUser();
    let user = User.fromApiObject(plainUser);

    ep.createEndpoint(
        DummyEndpointProvider.Method.PUT,
        "/users/" + plainUser.id,
        plainUser,
        async (req) => {
            checkIfApiUserMatchesParsed(user, req.body);
            done();
        }
    );

    await user.update(api);
});

test("user delete", async (done) => {
    let plainUser = createRandomUser();
    let user = User.fromApiObject(plainUser);
    ep.createEndpoint(
        DummyEndpointProvider.Method.DELETE,
        "/users/" + plainUser.id,
        {},
        (req) => {
            done();
        }
    );
    user.delete(api);
});

afterAll(() => {
    ep.closeServer();
});
