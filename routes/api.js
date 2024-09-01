// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

app.use(bodyParser.json()); // To parse JSON bodies

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const threadSchema = new mongoose.Schema({
  board: String,
  text: String,
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  delete_password: String,
  replies: [
    {
      text: String,
      created_on: { type: Date, default: Date.now },
      delete_password: String,
      reported: { type: Boolean, default: false }
    }
  ]
});

const Thread = mongoose.model('Thread', threadSchema);

// Define the createThread function
const createThread = async (req, res) => {
  console.log('Request received for creating thread');
  const { board } = req.params;
  const { text, delete_password } = req.body;

  try {
    const newThread = new Thread({
      board,
      text,
      delete_password,
      replies: []
    });

    await newThread.save();
    res.redirect(`/b/${board}`); // Redirect to the board page after creation
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Failed to create a new thread.' });
  }
};

// Define the route directly in the Express app
app.post('/api/threads/:board', createThread);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

  // Middleware for handling 404 errors (not found)
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });

  // Middleware for handling general errors
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send('Something broke!'); // Send a generic error message
  });

