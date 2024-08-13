# Use the official Node.js 16 image
FROM node:16 AS base

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the app source code
COPY . .

# Compile the TypeScript code
RUN npx tsc

# Build Stage
FROM base AS build

# Define the command to run the app
CMD ["node", "dist/index.js"]

# Test Stage
FROM base AS test

# Run tests
CMD ["npm", "test"]
