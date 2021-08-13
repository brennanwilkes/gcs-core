import "dotenv/config";
export default {
	defaultAudioId: process.env.DEFAULT_AUDIO_ID,
	port: parseInt(process.env.PORT ?? "8080"),
	verbose: (process.env.VERBOSE ?? "false") === "true",
	encryptionSecret: process.env.TOKEN_SECRET,
	encryptionExpiryTime: 21600,
	databaseConnectionString: process.env.DB_CONNECTION,
	defaultApiLimit: 5,
	maximumApiLimit: 50,
};
