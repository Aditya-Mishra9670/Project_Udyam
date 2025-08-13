// src/routes/formHandler.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { checkFormData } = require('../validator');

const router = express.Router();
const db = new PrismaClient();

// Handle form submissions
router.post('/', async (req, res) => {
  const validationError = checkFormData(req.body);

  if (validationError) {
    return res.status(400).json({ status: 'error', message: validationError });
  }

  try {
    const savedRecord = await db.submission.create({
      data: {
        name: req.body.name,
        aadhaar: req.body.aadhaar,
        pan: req.body.pan,
        pin: req.body.pin,
        city: req.body.city,
        state: req.body.state
      }
    });

    res.status(201).json({
      status: 'success',
      data: savedRecord
    });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while saving the form.'
    });
  }
});

module.exports = router;
