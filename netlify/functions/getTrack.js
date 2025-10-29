import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function handler(event) {
  try {
    const { mood } = JSON.parse(event.body || "{}");
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // simple mapping for mood types
    const moodMap = {
      happy: "happy upbeat",
      chill: "chill relaxing",
      sad: "sad emotional",
      focused: "focus concentration",
      romantic: "romantic love songs",
      energetic: "energy workout",
      nostalgic: "classic hits",
      motivated: "motivation pop rock",
    };

    const query = moodMap[mood] || "chill relaxing";
    const response = await spotifyApi.searchTracks(query, { limit: 10 });

    const tracks = response.body.tracks.items.map((track) => ({
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      albumCover: track.album.images[0]?.url,
      url: track.external_urls.spotify,
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({ tracks }),
    };
  } catch (error) {
    console.error("error fetching tracks:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch tracks" }),
    };
  }
}
