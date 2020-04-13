const ZammadApi = require("./src/ZammadApi");
const User = require("./src/User");

let api = new ZammadApi(
    "http://zammad.dev.exanion.de",
    "peter.kappelt@exanion.de",
    "passw0rd="
);

let main = async () => {
    console.log(await User.getUsers(api));
    await User.getUser(api, 3);
};

main();
