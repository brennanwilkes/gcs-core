// Brennan Wilkes

import RadioServer from "./backend/server";
import { mongoose } from "./database/connection";
import mainRouter from "./backend/routes/index";
import logger from "./backend/logging/logger";

const server = new RadioServer();

server.route("/", mainRouter);


mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function callback () {
	logger.logDBConnection();
	server.start();
});
