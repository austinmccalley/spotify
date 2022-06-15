// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const SCROLLABLE_BASE = 'https://ws.audioscrobbler.com/2.0/';

const getLastFMAlbum = async (artistName: string, albumName: string) => {

  if (!artistName)
    throw new Error('No Artist Name Provided');

  if (!albumName)
    throw new Error('No Album name Provided');

  const encodedArtistName = encodeURIComponent(artistName);
  const encodedAlbumName = encodeURIComponent(albumName);

  const url = `${SCROLLABLE_BASE}?method=album.getinfo&artist=${encodedArtistName}&album=${encodedAlbumName}&api_key=${process.env.SCROLLABLE_KEY}&format=json`;

  return axios.get(url).then(({ data }) => {
    return data
  })

}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, any>>
) {

  const { artistName, albumName } = req.query;

  getLastFMAlbum(artistName as string, albumName as string).then((data) => {
    res.status(200).json({ data })
  }).catch(err => {
    res.status(500).json({ err })
  })

  return
}
