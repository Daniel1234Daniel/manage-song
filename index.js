const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const songRoutes = require('./routes/songRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/api/songs', songRoutes);

// Connect to MongoDB

const CONNECTION_URL = "mongodb://127.0.0.1:27017/song-api"

mongoose.connect(CONNECTION_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
// Use song routes

