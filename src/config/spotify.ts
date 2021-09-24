import "dotenv/config";
export default {
	oauth2: {
		scope: ["user-top-read", "playlist-modify-public"]
	},
	credentials: {
		spotifyClientId: process.env.SPOTIFY_ID,
		spotifyClientSecret: process.env.SPOTIFY_SECRET
	}
};
