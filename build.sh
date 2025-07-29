#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd furni-store
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd furni-store
npm run build
cd ..

echo "✅ Build completed successfully!" 