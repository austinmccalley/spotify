import { AlbumObjectFull, TrackObjectFull } from "../types/top";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";

const SCROLLABLE_BASE = 'https://ws.audioscrobbler.com/2.0/';

const getLastFMAlbum = async (artistName: string, albumName: string) => {

  if (!artistName)
    throw new Error('No Artist Name Provided');

  if (!albumName)
    throw new Error('No Album name Provided');

  const encodedArtistName = encodeURIComponent(artistName);
  const encodedAlbumName = encodeURIComponent(albumName);

  const url = `${SCROLLABLE_BASE}?method=album.getinfo&artist=${encodedArtistName}&album=${encodedAlbumName}&api_key=${process.env.SCROLLABLE_KEY}&format=json`;

  axios.get(url).then(({ data }) => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  })

}


const getTopTracks = async (token: string, limit: number): Promise<TrackObjectFull[]> => {
  if (!token) {
    throw new Error('No token provided');
  }

  if (!limit) {
    limit = 20
  }

  const spotifyApi = new SpotifyWebApi();

  spotifyApi.setAccessToken(token);

  return (await spotifyApi.getMyTopTracks({ limit: limit })).items
}


const getAlbum = async (token: string, id: string): Promise<AlbumObjectFull> => {

  // Sleep for some random delay to prevent rate limiting
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

  if (!token) {
    throw new Error('No token provided');
  }

  if (!id) {
    throw new Error('No id provided');
  }

  const spotifyApi = new SpotifyWebApi();

  spotifyApi.setAccessToken(token);

  return spotifyApi.getAlbum(id)
}

export {
  getTopTracks,
  getAlbum,
  getLastFMAlbum
}