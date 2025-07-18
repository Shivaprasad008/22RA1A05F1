const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/urlShortener');

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortId: String,
});

const Url = mongoose.model('Url', urlSchema);

app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(6);
  await Url.create({ originalUrl, shortId });
  res.json({ shortUrl: `http://localhost:5000/${shortId}` });
});

app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const url = await Url.findOne({ shortId });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));