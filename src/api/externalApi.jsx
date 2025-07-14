import { API_CONFIG } from "../config/api.config";
import { getCookie, isSpotifyTokenExpired } from "../utils/tokenUtils";
import { searchType } from "../const";

export async function getYoutubeSong(songNames) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=5&q=${encodeURIComponent(
        songNames
      )}&key=${API_CONFIG.YOUTUBE_API_KEY}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi gọi Youtube API:", error);
  }
}


async function getSpotifyToken() {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/get-spotify-token`,
      {
        method: "POST",
        mode: "cors",
      }
    );

    if (!response.ok) {
      throw new APIError(
        response.status
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi gọi Spotify API token:", error);
  }
}

export async function getSpotifyPlaylist(keywords, type) {
  let spotifyToken = getCookie("spotify_token");
  if(!spotifyToken || isSpotifyTokenExpired()) {
    spotifyToken = await getSpotifyToken();

    const maxAge = spotifyToken.expires_in;
    document.cookie = `spotify_token=${spotifyToken.access_token}; path=/; max-age=${maxAge}`;
    const expiresAt = Date.now() + maxAge * 1000;
    document.cookie = `spotify_expires_at=${expiresAt}; path=/; max-age=${maxAge}`;
  }

  try {
    const query = type === searchType.PLAYLIST ? `nhạc ${keywords}` : keywords;
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${ type === searchType.PLAYLIST ? 'playlist' : 'track'}&limit=5`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return type === searchType.PLAYLIST ? data.playlists.items : data.tracks.items; // array of playlist objects
    
  } catch (error) {
    console.error("Lỗi gọi Spotify API:", error);
    return [];
  }
}