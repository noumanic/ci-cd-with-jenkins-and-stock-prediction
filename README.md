# Stockify - CI/CD with Jenkins & Rule-Based Stock Prediction

## Project Overview
This project implements a complete CI/CD workflow using Jenkins with GitHub integration for a stock prediction application. The application consists of three main components:

- **Frontend**: Modern React application with professional UI, animations, and responsive design
- **Backend**: Flask API with rule-based stock prediction (3-day moving average) and dynamic confidence calculation
- **Database**: MySQL database for storing historical stock data

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │    Database     │
│   (Port 3000)   │◄──►│   (Port 5000)   │◄──►│   (Port 3306)   │
│   React/Node.js │    │   Flask API     │    │     MySQL       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Branch Structure

- **main**: Production-ready code (only updated via PRs)
- **frontend**: Frontend development branch
- **backend**: Backend API development branch  
- **database**: Database schema and scripts branch

## CI/CD Pipeline

The Jenkins pipeline includes the following stages:

1. **Checkout**: Pull latest code from main branch
2. **Install Dependencies**: Install Python and Node.js dependencies
3. **Run Tests**: Execute backend tests and frontend build verification
4. **Build Docker Images**: Create Docker images for all components
5. **Push Docker Images**: Upload images to DockerHub
6. **Deploy Containers**: Start the application using Docker Compose
7. **Integration Tests**: Verify all services are working correctly

## Setup Instructions

### Prerequisites
- Docker Desktop installed and running
- Jenkins server configured
- DockerHub account for image storage
- GitHub repository with webhook configured

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MLOPS-Fall-2025/ci-cd-with-jenkins-and-stock-prediction-neuralnouman.git
   cd ci-cd-with-jenkins-and-stock-prediction-neuralnouman
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **For React development**:
   ```bash
   cd frontend
   npm install
   npm run dev  # Starts React dev server on port 3000
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:3306

### Jenkins Configuration

1. **Create a new Pipeline job** in Jenkins
2. **Configure GitHub webhook** to trigger on PR merges to main
3. **Set up DockerHub credentials** in Jenkins credentials store
4. **Update DockerHub username** in Jenkinsfile
5. **Configure webhook URL** in GitHub repository settings

### API Endpoints

- `GET /health` - Health check
- `GET /api/predict/<symbol>` - Get stock prediction
- `GET /api/history/<symbol>` - Get historical data
- `GET /api/symbols` - Get available symbols

### Available Stock Symbols
- AAPL (Apple)
- GOOGL (Google)
- MSFT (Microsoft)
- TSLA (Tesla)
- AMZN (Amazon)

### Key Features
- **Dynamic Confidence**: Prediction confidence calculated based on market volatility
- **Professional UI**: Modern React frontend with glass morphism design
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Analysis**: Live stock data processing
- **Interactive Charts**: Historical data visualization with Chart.js
- **Rule-Based Predictions**: 3-day moving average algorithm

## Testing

### Backend Tests
```bash
cd backend
python -m pytest test_app.py -v
```

### Frontend Tests
```bash
cd frontend
npm install
npm run build
npm run test:ci
```

### Integration Tests
```bash
# Test API endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/predict/AAPL
```

## Deployment

The application is automatically deployed when:
1. A Pull Request is merged into the main branch
2. GitHub webhook triggers Jenkins pipeline
3. Pipeline builds, tests, and deploys the application

## Monitoring

- Jenkins provides build logs and status
- Docker Compose shows container health
- Application logs available via `docker-compose logs`

## Troubleshooting

### Common Issues

1. **Docker images not building**: Check Dockerfile syntax and dependencies
2. **Database connection failed**: Verify MySQL container is running
3. **API calls failing**: Check backend container health and port mapping
4. **Jenkins pipeline failing**: Review Jenkins logs and webhook configuration

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## Contributing

1. Create a feature branch from main
2. Make your changes
3. Test locally using Docker Compose
4. Create a Pull Request to main
5. Jenkins will automatically test and deploy on merge

## License

This project is part of the MLOPS Fall 2025 course assignment.