import { start } from "./app.js";
import { config } from "./config/env.js";

start().catch((error) => {
  console.error(`[api] failed to start: ${error.message}`);

  if (
    error.name === "MongooseServerSelectionError" ||
    error.name === "MongoParseError" ||
    /ECONNREFUSED|querySrv|ENOTFOUND|Server selection|Invalid scheme|invalid connection string/i.test(
      error.message
    )
  ) {
    console.error(
      [
        "",
        "  MongoDB is not reachable with the URI in backend/.env:",
        `  ${config.mongoUri}`,
        "",
        "  Fix it with one of:",
        "    - MongoDB Atlas (free): cloud.mongodb.com -> create a free M0 cluster,",
        "      add a database user, allow your IP in Network Access, then paste the",
        "      connection string into MONGODB_URI",
        "    - local server:          brew tap mongodb/brew && brew install mongodb-community",
        "                             brew services start mongodb-community",
        "",
      ].join("\n")
    );
  } else {
    console.error(error);
  }

  process.exit(1);
});
