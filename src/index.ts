// Brennan Wilkes

import RadioServer from "./backend/server";
import mainRouter from "./backend/routes/index";
import logger from "./backend/logging/logger";

const server = new RadioServer();

server.route("/", mainRouter);


logger.logDBConnection();
server.start();
