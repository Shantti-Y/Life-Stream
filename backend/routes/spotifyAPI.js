const axios = require('axios');
const moment = require('moment');

class SpotifyClientSingleton {
  constructor(expiredDuration, tokenType, accessToken){
    this.expiredTime = moment().seconds(expiredDuration);
    this.requestConfiguration = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      timeout: 4000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`
      }
    });
  }

  isExpired(){
    return moment() >= this.expiredTime
  }
}
let spotifyClient;

const getSpotifyClient = async () => {
  if (spotifyClient === undefined || spotifyClient.isExpired()){
    await postAuthorize();
  }
  return spotifyClient
}

const postAuthorize = async () => {
  const clientId = process.env.SPOTIFY_API_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_API_CLIENT_SECRET;

  const { data } = await axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    timeout: 4000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    params: {
      'grant_type': 'client_credentials'
    },
    auth: {
      username: clientId,
      password: clientSecret
    }
  });
  spotifyClient = new SpotifyClientSingleton(data.expires_in, data.token_type, data.access_token);
}

///////////////////////////
/* General API endpoints */
///////////////////////////
module.exports = {
  getArtistTopTracks: async (artistId) => {
    const client = await getSpotifyClient()
    const { data } = await client.requestConfiguration.get(`/artists/${artistId}/top-tracks`, {
      params: {
        country: 'JP'
      }
    });
    return data.tracks.data
  },

  getCandidatedArtists: async (query) => {
    const client = await getSpotifyClient()
    const { data } = await client.requestConfiguration.get(`/search`, {
      params: {
        type: 'artist',
        q: query,
        limit: 10
      }
    });
    return data.artists.data
  }
}
