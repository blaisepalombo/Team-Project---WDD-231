import { spotifyApi, authorizeSpotify } from "./spotifyClient.js";

export async function handler(event) {
  try {
    const { name } = JSON.parse(event.body || "{}");

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Artist name is required" }),
      };
    }

    await authorizeSpotify();

    const result = await spotifyApi.searchArtists(name, { limit: 20 });

    const artists = result.body.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      followers: artist.followers.total,
      image: artist.images[0]?.url,
      url: artist.external_urls.spotify,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ artists }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
