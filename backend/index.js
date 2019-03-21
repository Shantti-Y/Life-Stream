const path = require('path');
const express = require('express');
const router = require('./routes');
require('dotenv').config();

const app = express(),
  DIST_DIR = path.resolve(__dirname, `../dist/dev`);

app.use(express.static(DIST_DIR));
app.use(router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
});
