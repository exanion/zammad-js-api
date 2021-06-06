/**
 * @jest-environment node
 */

const { DummyEndpointProvider } = require("./utility/DummyEndpointProvider");
const DataSeeder = require("./utility/DataSeeder");

const ZammadApi = require("../src/ZammadApi");
const TicketArticle = require("../src/TicketArticle");

let api;
let ep;

beforeAll(() => {
    ep = new DummyEndpointProvider("/api/v1");
    api = new ZammadApi(`http://localhost:${ep.port}`);
});

/**
 * Create a user json object with random data
 */
function createRandomArticle() {
    const id = DataSeeder.randomId();
    const ticket_id = DataSeeder.randomId();
    const sender_id = DataSeeder.randomId();
    const subject = DataSeeder.randomString(10);
    const body = DataSeeder.randomString(50);
    const content_type = DataSeeder.randomString(10);
    const internal = DataSeeder.randomBool();
    const type = DataSeeder.randomString(10);
    const sender = "System";
    const from = DataSeeder.randomMail();
    const to = DataSeeder.randomMail();
    const cc = DataSeeder.randomMail();
    const createdById = DataSeeder.randomId();
    const updatedById = DataSeeder.randomId();
    const updatedAt = DataSeeder.randomIsoTimestamp();
    const createdAt = DataSeeder.randomIsoTimestamp();

    return {
        id,
        ticket_id,
        sender_id,
        subject,
        body,
        content_type,
        internal,
        type,
        sender,
        from,
        to,
        cc,
        created_by_id: createdById,
        updated_by_id: updatedById,
        updated_at: updatedAt,
        created_at: createdAt,
    };
}

/**
 * Check if api article object matches parsed article
 * @param {object} apiArticle json article api object
 * @param {object} parsedArticle article parsed by the implementation
 */
function checkIfApiArticleMatchesParsed(apiArticle, parsedArticle) {
    expect(typeof parsedArticle).toBe("object");
    expect(typeof apiArticle).toBe("object");

    expect(parsedArticle.id).toBe(apiArticle.id);
    expect(parsedArticle.ticketId).toBe(apiArticle.ticket_id);
    expect(parsedArticle.senderId).toBe(apiArticle.sender_id);
    expect(parsedArticle.subject).toBe(apiArticle.subject);
    expect(parsedArticle.body).toBe(apiArticle.body);
    expect(parsedArticle.contentType).toBe(apiArticle.content_type);
    expect(parsedArticle.internal).toBe(apiArticle.internal);
    expect(parsedArticle.type).toBe(apiArticle.type);
    expect(parsedArticle.sender).toBe(apiArticle.sender);
    expect(parsedArticle.from).toBe(apiArticle.from);
    expect(parsedArticle.to).toBe(apiArticle.to);
    expect(parsedArticle.cc).toBe(apiArticle.cc);
    expect(parsedArticle.createdById).toBe(apiArticle.created_by_id);
    expect(parsedArticle.updatedById).toBe(apiArticle.updated_by_id);
    expect(parsedArticle.updatedAt).toBe(apiArticle.updated_at);
    expect(parsedArticle.createdAt).toBe(apiArticle.created_at);
}

test("article by ticket id", async () => {
    let randomApiArticles = Array(Math.floor(Math.random() * 9) + 1);
    let requestMade = false;

    for (i = 0; i < randomApiArticles.length; i++) {
        randomApiArticles[i] = createRandomArticle();
    }
    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/ticket_articles/by_ticket/" + randomApiArticles[0].ticket_id,
        randomApiArticles,
        (req) => {
            requestMade = true;
        }
    );

    let response = await TicketArticle.getForTicket(
        api,
        randomApiArticles[0].ticket_id
    );
    let checkedObjects = 0;

    for (i = 0; i < response.length; i++) {
        //iterate over all users, search for matching json object
        randomApiArticles.forEach((obj) => {
            if (obj.id == response[i].id) {
                checkIfApiArticleMatchesParsed(obj, response[i]);
                checkedObjects++;
            }
        });
    }

    expect(checkedObjects).toBe(randomApiArticles.length);
    expect(requestMade).toBe(true);
});

test("show article details", async () => {
    let article = createRandomArticle();
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.GET,
        "/ticket_articles/" + article.id,
        article,
        (req) => {
            requestMade = true;
        }
    );

    let response = await TicketArticle.getById(api, article.id);

    checkIfApiArticleMatchesParsed(article, response);
    expect(requestMade).toBe(true);
});

test("article create", async () => {
    let plainArticle = createRandomArticle();
    let article;
    let requestMade = false;

    ep.createEndpoint(
        DummyEndpointProvider.Method.POST,
        "/ticket_articles",
        plainArticle,
        async (req) => {
            ["body", "subject", "content_type", "internal", "type"].forEach(
                (key) => {
                    expect(req.body[key]).toBe(plainArticle[key]);
                }
            );
            requestMade = true;
        }
    );

    article = await TicketArticle.create(api, {
        body: plainArticle.body,
        ticketId: plainArticle.ticket_id,
        subject: plainArticle.subject,
        contentType: plainArticle.content_type,
        internal: plainArticle.internal,
        type: plainArticle.type,
    });

    checkIfApiArticleMatchesParsed(plainArticle, article);
    expect(requestMade).toBe(true);
});

afterAll(() => {
    ep.closeServer();
});
