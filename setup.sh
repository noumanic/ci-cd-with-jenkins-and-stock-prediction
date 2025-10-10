#!/bin/bash

# Stockify - Setup Script for WSL2 Ubuntu
# This script helps set up the development environment

echo "🚀 Setting up Stockify - Rule-Based Stock Prediction App..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

echo "✅ Git is available"

# Create branches if they don't exist
echo "📝 Creating branches..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Create branches
git checkout -b frontend 2>/dev/null || git checkout frontend
git checkout -b backend 2>/dev/null || git checkout backend  
git checkout -b database 2>/dev/null || git checkout database
git checkout main

echo "✅ Branches created/checked out"

# Build Docker images
echo "🐳 Building Docker images..."

echo "Building backend image..."
docker build -t stock-prediction-backend ./backend

echo "Building React frontend image..."
echo "This may take a few minutes as it builds the React app with Tailwind CSS..."
docker build -t stockify-frontend ./frontend

echo "Building database image..."
docker build -t stock-prediction-database ./database

echo "✅ Docker images built"

# Test the application
echo "🧪 Testing the application..."

# Start the application
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
echo "This may take longer for the React frontend to build..."
sleep 45

# Test backend health
echo "Testing backend health..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Test frontend health (React app served by Nginx)
echo "Testing React frontend health..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ React frontend is healthy"
else
    echo "❌ React frontend health check failed"
    echo "Trying main page..."
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        echo "✅ React frontend main page is accessible"
    else
        echo "❌ React frontend is not responding"
    fi
fi

# Test stock prediction API
echo "Testing stock prediction API..."
if curl -f "http://localhost:5000/api/predict/AAPL" > /dev/null 2>&1; then
    echo "✅ Stock prediction API is working"
else
    echo "❌ Stock prediction API test failed"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Access the Stockify React application at http://localhost:3000"
echo "2. Test the API at http://localhost:5000/api/predict/AAPL"
echo "3. The frontend features modern UI with dynamic confidence calculation"
echo "4. Configure Jenkins pipeline with the Jenkinsfile"
echo "5. Set up GitHub webhook for CI/CD"
echo "6. Update DockerHub credentials in Jenkinsfile"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: docker-compose logs"
echo "- Stop services: docker-compose down"
echo "- Restart services: docker-compose restart"
echo "- View running containers: docker-compose ps"
echo "- Install dependencies: cd frontend && npm install"
echo "- Test React build locally: cd frontend && npm run build && npm run test:ci"
echo "- Run React dev server: cd frontend && npm run dev"
echo "- Serve React build: cd frontend && npm run build && npm run serve"
echo "- View Stockify features: Modern UI, dynamic confidence, professional animations"
