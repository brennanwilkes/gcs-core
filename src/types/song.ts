import { SongDoc } from "../database/models/song";
import { SpotifyResult } from "./spotifyResult";
import { Link } from "./link";

export interface ExternalId{
	id: string,
	label: string
}

export interface Song{
	title: string,
	artist: string,
	album: string,
	duration: number,
	explicit: boolean,
	ids: ExternalId[],
	id?: string,
	thumbnailUrl: string,
	releaseDate: string
}
export interface SongWithId extends Song{
	id: string
}

export interface SongApi extends Song{
	links: Link[]
}

export class SongObj implements Song {
	title: string;
	artist: string;
	album: string;
	duration: number;
	explicit: boolean;
	ids: ExternalId[];
	id?: string;
	thumbnailUrl: string;
	releaseDate: string;
	constructor (
		title: string,
		artist: string,
		album: string,
		duration: number,
		explicit: boolean,
		ids: {
			spotifyId?: string
			youtubeId?: string,
			musicKitId?: string,
		} | ExternalId[],
		thumbnailUrl: string,
		releaseDate: string,
		id?: string
	) {
		this.title = title;
		this.artist = artist;
		this.album = album;
		this.duration = duration;
		this.explicit = explicit;

		if(Array.isArray(ids)){
			this.ids = ids;
		}
		else{
			this.ids = [];
			if(ids.spotifyId){
				this.ids = [{
					label: "spotify",
					id: ids.spotifyId
				}];
			}
			if(ids.youtubeId){
				this.ids = [...this.ids, {
					label: "youtube",
					id: ids.youtubeId
				}];
			}
			if(ids.musicKitId){
				this.ids = [...this.ids, {
					label: "musicKit",
					id: ids.musicKitId
				}];
			}
		}
		this.thumbnailUrl = thumbnailUrl;
		this.releaseDate = releaseDate;
		if (id) this.id = id;
	}
}

export class SongObjFromQuery extends SongObj implements Song {
	constructor (results: SongDoc) {
		super(
			results.title,
			results.artist,
			results.album,
			results.duration,
			results.explicit,
			{
				spotifyId: results.spotifyId,
				youtubeId: results.youtubeId,
				musicKitId: results.musicKitId
			},
			results.thumbnailUrl,
			results.releaseDate,
			String(results._id)
		);
	}
}

export class SongApiObj extends SongObj implements SongApi {
	links: Link[]
	constructor (songBase: Song, links: Link[]) {
		super(
			songBase.title,
			songBase.artist,
			songBase.album,
			songBase.duration,
			songBase.explicit,
			songBase.ids,
			songBase.thumbnailUrl,
			songBase.releaseDate,
			songBase.id
		);
		this.links = links;
	}
}

export class SongFromSpotify extends SongObj implements Song {
	constructor (spotifyResult: SpotifyResult, id?: string) {
		super(
			spotifyResult.title,
			spotifyResult.artist,
			spotifyResult.album,
			spotifyResult.duration,
			spotifyResult.explicit,
			{
				spotifyId: spotifyResult.spotifyId
			},
			spotifyResult.thumbnailUrl,
			spotifyResult.releaseDate,
			id
		);
	}
}
