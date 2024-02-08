const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const songRoutes = require('./routes/songRoutes');
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/api/songs', songRoutes);

// Connect to MongoDB
CONNECTION_URL_DB="mongodb+srv://addis:HeT6p43rv9ipx5UV@cluster0.bqxqx.mongodb.net/song-api?retryWrites=true&w=majority"

// const CONNECTION_URL = "mongodb://127.0.0.1:27017/song-api"

mongoose.connect(CONNECTION_URL_DB,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
// Use song routes

