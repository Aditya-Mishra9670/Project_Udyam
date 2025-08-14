# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend files
COPY udyam_backend/package*.json ./udyam_backend/
COPY udyam_backend/prisma ./udyam_backend/prisma
COPY udyam_backend/src ./udyam_backend/src

# Install backend dependencies
WORKDIR /app/udyam_backend
RUN npm install

# Copy frontend files
WORKDIR /app
COPY udyam_frontend/package*.json ./udyam_frontend/
COPY udyam_frontend/src ./udyam_frontend/src
COPY udyam_frontend/*.js ./udyam_frontend/
COPY udyam_frontend/*.json ./udyam_frontend/
COPY udyam_frontend/*.config.js ./udyam_frontend/
COPY udyam_frontend/*.html ./udyam_frontend/

# Install frontend dependencies
WORKDIR /app/udyam_frontend
RUN npm install && npm run build

# Expose backend port
EXPOSE 3000

# Start backend
WORKDIR /app/udyam_backend
CMD ["npm", "start"]
