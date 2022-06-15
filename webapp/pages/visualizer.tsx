import { NextPage } from 'next';
import SpotifyWebApi from 'spotify-web-api-js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TrackObjectFull } from '../types/top';
import styles from '../styles/Visualize.module.css';
import ImageShimmer from '../components/ImageShimmer';
import { getTopTracks } from '../utils/spotify';
import axios from 'axios';
import genres from '../utils/genres';
import * as wasm from 'pca-wasm';

const Visualize: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const spotifyApi = new SpotifyWebApi();

  const [top, setTop] = useState<TrackObjectFull[]>([]);
  const [g, setG] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      getTopTracks(token as string, 25)
        .then((lTop) => {
          setTop(lTop);
          return lTop;
        })
        .then(async (lTop) => {
          const goodTracks = lTop.filter(
            (track) => track.album.album_type !== 'SINGLE'
          );

          let albums = goodTracks.map((track) => {
            return axios.get(
              '/api/getAlbum?artistName=' +
                track.artists[0].name +
                '&albumName=' +
                track.album.name
            );
          });

          const pAlbums = await Promise.all(albums);

          return pAlbums.map((album) => album.data.data.album || {});
        })
        .then((albums) => {
          const tags = albums.map((album) => album.tags.tag);
          const flatTags = tags.flat();
          const tagNames = flatTags.map((tag) => tag?.name || 'blank');

          const tagCounts: Record<string, number> = tagNames.reduce(
            (acc, curr) => {
              if (acc[curr]) {
                acc[curr] += 1;
              } else {
                acc[curr] = 1;
              }
              return acc;
            },
            {}
          );

          const tagCountsSorted = Object.keys(tagCounts).sort(
            (a, b) => tagCounts[b] - tagCounts[a]
          );

          const filtered = tagCountsSorted.filter((tag) => {
            return genres.includes(tag.toLowerCase());
          });

          setG(filtered);

          return [tagCounts, albums];
        })
        .then(([tagCounts, albums]) => {
          console.log(tagCounts, albums);

          const tc = tagCounts as Record<string, number>;

          const vector: number[] = genres.map((genre) => {
            return tc[genre] || 0;
          });

          const test = new Float64Array(new Float64Array(vector));

          const result = wasm.principal_component_analysis(test, 2, 1);

          console.log(result);

          // Show only unique values in result
          const unique = [...new Set(result)];
          console.log(unique);
        });
    }
  }, [token]);

  return (
    <div className={styles.main}>
      <h1>Visualize</h1>
      <div>
        {top.map(
          (track) =>
            // Skip singles
            track.album.album_type !== 'SINGLE' && (
              <div
                key={track.name}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  marginBottom: '2rem',
                  border: '1px solid rgb(0, 0, 0)',
                }}
              >
                <ImageShimmer
                  src={track.album.images[0].url}
                  alt={track.name}
                  width={track.album.images[0].width || 0}
                  height={track.album.images[0].height || 0}
                />
                <p
                  style={{
                    textAlign: 'center',
                  }}
                >
                  {track.name}
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Visualize;
