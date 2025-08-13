const express = require('express');
const cors = require('cors');
const path = require('path');

const { PrismaClient } = require('@prisma/client');
const { checkFormData, checkAadhaarAndName } = require('./validation');
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Set your deployed frontend URL
  credentials: true,
};
const server = express();
const db = new PrismaClient();

// Middleware
server.use(cors(corsOptions));
server.use(express.json());

//Just to keep the server alive
server.get("/ping", (req, res) => {
  res.send("pong");
});

// GET: Send Form_data.json to frontend
server.get('/api/formfields', (req, res) => {
    
        console.log('Access granted to form fields');
        const filePath = path.join(__dirname, '..', '..', 'udyam_form_fields.json');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending Form_data.json:', err);
                res.status(500).json({ status: 'error', message: 'Unable to load form data' });
            }
        });
   
});


// Endpoint: Handle form submissions
server.post('/api/submit', async (req, res) => {
  console.log('Received form submission:', req.body);
  const validationError = checkFormData(req.body);
  if (validationError) {
    return res.status(400).json({
      status: 'error',
      message: validationError
    });
  }

  try {
    const savedEntry = await db.Submission.create({
      data: req.body
    });
    res.status(201).json({
      status: 'success',
      data: savedEntry
    });
  } catch (error) {
    console.error('Database save error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Unable to process request at the moment.'
    });
  }
});

// Boot up the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is active at: http://localhost:${PORT}`);
});
