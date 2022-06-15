/**
* External Url Object
* [](https://developer.spotify.com/web-api/object-model/)
*
* Note that there might be other types available, it couldn't be found in the docs.
*/
interface ExternalUrlObject {
  spotify: string;
}


/**
  * Simplified Artist Object
  * [artist object (simplified)](https://developer.spotify.com/web-api/object-model/)
  */
interface ArtistObjectSimplified {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

/**
 * Track Link Object
 * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
 */
interface TrackLinkObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  type: 'track';
  uri: string;
}

/**
 * Simplified Track Object
 * [track object (simplified)](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
 */
export interface TrackObjectSimplified {
  artists: ArtistObjectSimplified[];
  available_markets?: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: TrackLinkObject;
  name: string;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
}

/**
 * External Id object
 * [](https://developer.spotify.com/web-api/object-model/)
 *
 * Note that there might be other types available, it couldn't be found in the docs.
 */
interface ExternalIdObject {
  isrc?: string;
  ean?: string;
  upc?: string;
}

/**
 * Image Object
 * [](https://developer.spotify.com/web-api/object-model/)
 */
interface ImageObject {
  height?: number;
  url: string;
  width?: number;
}

/**
 * Simplified Album Object
 * [album object (simplified)](https://developer.spotify.com/web-api/object-model/#album-object-simplified)
 */
interface AlbumObjectSimplified {
  album_type: string;
  available_markets?: string[];
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  type: 'album';
  uri: string;
}

/**
 * Full Track Object
 * [track object (full)](https://developer.spotify.com/web-api/object-model/#track-object-full)
 */
export interface TrackObjectFull extends TrackObjectSimplified {
  album: AlbumObjectSimplified;
  external_ids: ExternalIdObject;
  popularity: number;
}

/**
 * Copyright object
 * [copyright object](https://developer.spotify.com/web-api/object-model/)
 */
interface CopyrightObject {
  text: string;
  type: 'C' | 'P';
}

/**
 * Paging Object wrapper used for retrieving collections from the Spotify API.
 * [](https://developer.spotify.com/web-api/object-model/#paging-object)
 */
interface PagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

/**
* Full Album Object
* [album object (full)](https://developer.spotify.com/web-api/object-model/#album-object-simplified)
*/
export interface AlbumObjectFull extends AlbumObjectSimplified {
  artists: ArtistObjectSimplified[];
  copyrights: CopyrightObject[];
  external_ids: ExternalIdObject;
  genres: string[];
  popularity: number;
  release_date: string;
  release_date_precision: string;
  tracks: PagingObject<TrackObjectSimplified>;
}