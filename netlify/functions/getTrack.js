import { spotifyApi, authorizeSpotify } from "./spotifyClient.js";

export async function handler(event) {
  try {
    const { mood } = JSON.parse(event.body || "{}");
    await authorizeSpotify();

    const moodMap = {
      happy: "happy upbeat",
      chill: "chill relaxing",
      sad: "sad emotional",
      focused: "focus concentration",
      romantic: "romantic love songs",
      energetic: "energy workout",
      nostalgic: "classic hits",
      motivated: "motivation pop rock",
      DR: "Dembow",
    };

    const query = moodMap[mood] || "chill relaxing";
    const response = await spotifyApi.searchTracks(query, { limit: 20 });

    const tracks = response.body.tracks.items.map((track) => ({
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumCover: track.album.images[0]?.url,
      url: track.external_urls.spotify,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ tracks }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch tracks" }),
    };
  }
}
