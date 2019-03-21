const path = require('path');
const express = require('express');
const router = express.Router();

const spotifyAPIClient = require('./spotifyAPI');


// Entry endpoints
// const htmlFile = path.resolve(__dirname, './index.html');
// router.get('/*', (req, res) => {
//   res.sendFile(htmlFile);
// });

// API endpoints
router.get('/api/search', async (req, res) => {
  const responseData = await spotifyAPIClient.getCandidatedArtists('shiggy jr');
  res.json({ data: responseData })
});

router.get('/api/top-tracks', async (req, res) => {
  const responseData = await spotifyAPIClient.getArtistTopTracks('3jwKAvUYZUeARRBlFUWkzj');
  res.json({ data: responseData })
});

module.exports = router; 