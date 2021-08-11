import { Song, SongFromSpotify } from "../../types/song";
import { SpotifyResult } from "../../types/spotifyResult";
import youtubePlayableConverter from "../youtube/youtubePlayableConverter";
import musicKitPlayableConverter from "../musicKit/musicKitPlayableConverter";
import { basePlayableConverter } from "../../types/playables/playable";

const conversions = [
	{
		label: "youtube",
		converter: youtubePlayableConverter
	},
	{
		label: "musicKit",
		converter: musicKitPlayableConverter
	}
];

const converters =
	(labels: string[]): basePlayableConverter<Song>[] =>
		conversions.filter(conversionMapping => labels.includes(conversionMapping.label)).map(conversionMapping => conversionMapping.converter);

export default function (spotifyResults: SpotifyResult[], labels: string[]): Promise<Song[]> {
	return Promise.all(spotifyResults.map(async spotify => {
		let song: Song = new SongFromSpotify(spotify);
		const upgrades = await Promise.all(converters(labels).map(converter => converter.upgradeToPlayable(song).catch(() => undefined)));
		upgrades.forEach(upgrade => {
			if (upgrade) {
				song = { ...song, ...upgrade };
			}
		});
		return song;
	}));
}
