// tests/userForm.test.js

const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const server = express();
server.use(express.json());

const db = new PrismaClient();

// Mock form submission route (simplified for testing)
server.post('/api/register', async (req, res) => {
  const { fullName, aadhaarNo, panCard, postalCode, cityName, stateName } = req.body;

  // Required fields check
  if ([fullName, aadhaarNo, panCard, postalCode, cityName, stateName].some(f => !f)) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields.' });
  }

  // Patterns
  const aadhaarPattern = /^\d{12}$/;
  const panPattern = /^[A-Z]{5}\d{4}[A-Z]$/i;
  const pinPattern = /^\d{6}$/;

  if (!aadhaarPattern.test(aadhaarNo)) {
    return res.status(400).json({ status: 'error', message: 'Aadhaar must be 12 digits.' });
  }
  if (!panPattern.test(panCard)) {
    return res.status(400).json({ status: 'error', message: 'PAN format is incorrect.' });
  }
  if (!pinPattern.test(postalCode)) {
    return res.status(400).json({ status: 'error', message: 'Postal code must be 6 digits.' });
  }

  try {
    const record = await db.submission.create({
      data: {
        name: fullName,
        aadhaar: aadhaarNo,
        pan: panCard,
        pin: postalCode,
        city: cityName,
        state: stateName
      }
    });
    res.status(201).json({ status: 'success', saved: record });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Database insertion failed.' });
  }
});

describe('User Form Registration API', () => {
  it('rejects when PAN is in the wrong format', async () => {
    const response = await request(server).post('/api/register').send({
      fullName: 'Ravi Kumar',
      aadhaarNo: '987654321098',
      panCard: 'AB1234567', // wrong format
      postalCode: '110011',
      cityName: 'Delhi',
      stateName: 'Delhi'
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/PAN format/i);
  });

  it('rejects when Aadhaar length is incorrect', async () => {
    const response = await request(server).post('/api/register').send({
      fullName: 'Meena Sharma',
      aadhaarNo: '1234', // too short
      panCard: 'QWERT1234Z',
      postalCode: '400001',
      cityName: 'Mumbai',
      stateName: 'Maharashtra'
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Aadhaar/i);
  });

  it('accepts valid registration details', async () => {
    const response = await request(server).post('/api/register').send({
      fullName: 'Sandeep Verma',
      aadhaarNo: '123456789012',
      panCard: 'ABCDE1234F',
      postalCode: '560103',
      cityName: 'Bengaluru',
      stateName: 'Karnataka'
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
  });
});
