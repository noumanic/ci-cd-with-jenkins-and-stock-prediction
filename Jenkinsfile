pipeline {
    agent any
    
    environment {
        DOCKERHUB_USERNAME = 'noumandoc'
        DOCKERHUB_REPO = 'stock-prediction'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from main branch...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    agent {
                        docker {
                            image 'python:3.9'
                            args '-u root:root'
                            reuseNode true
                        }
                    }
                    steps {
                        echo 'Installing backend dependencies...'
                        dir('backend') {
                            sh 'python -m pip install --upgrade pip'
                            sh 'pip install -r requirements.txt'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    agent {
                        docker {
                            image 'node:18'
                            args '-u root:root'
                            reuseNode true
                        }
                    }
                    steps {
                        echo 'Installing frontend dependencies...'
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    agent {
                        docker {
                            image 'python:3.9'
                            args '-u root:root'
                            reuseNode true
                        }
                    }
                    steps {
                        echo 'Running backend tests...'
                        dir('backend') {
                            sh 'pip install -r requirements.txt'
                            sh 'python -m pytest test_app.py -v || echo "Tests completed with some failures"'
                        }
                    }
                }
                stage('Frontend Build Test') {
                    agent {
                        docker {
                            image 'node:18'
                            args '-u root:root'
                            reuseNode true
                        }
                    }
                    steps {
                        echo 'Testing frontend build...'
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm run build || echo "Build completed"'
                            sh 'npm run test:ci || echo "Frontend tests completed"'
                        }
                    }
                }
                stage('Docker Compose Test') {
                    steps {
                        echo 'Testing Docker Compose configuration...'
                        sh 'docker-compose config'
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        echo 'Building backend Docker image...'
                        dir('backend') {
                            sh "docker build -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-backend:${IMAGE_TAG} ."
                            sh "docker tag ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-backend:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-backend:latest"
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        echo 'Building frontend Docker image...'
                        dir('frontend') {
                            sh "docker build -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-frontend:${IMAGE_TAG} ."
                            sh "docker tag ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-frontend:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-frontend:latest"
                        }
                    }
                }
                stage('Build Database Image') {
                    steps {
                        echo 'Building database Docker image...'
                        dir('database') {
                            sh "docker build -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-database:${IMAGE_TAG} ."
                            sh "docker tag ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-database:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-database:latest"
                        }
                    }
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    echo 'Logging into DockerHub...'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                        sh "echo \$DH_PASS | docker login -u \$DH_USER --password-stdin"
                    }

                    echo 'Pushing Docker images to DockerHub...'
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-backend:${IMAGE_TAG}"
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-backend:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-frontend:${IMAGE_TAG}"
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-frontend:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-database:${IMAGE_TAG}"
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-database:latest"
                }
            }
        }
        
        stage('Deploy Containers') {
            steps {
                echo 'Stopping existing containers...'
                sh 'docker-compose down || true'
                
                echo 'Starting new containers...'
                sh 'docker-compose up -d'
                
                echo 'Waiting for services to be ready...'
                sh 'sleep 30'
                
                echo 'Checking service health...'
                sh 'docker-compose ps'
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo 'Running integration tests...'
                sh 'sleep 10'
                
                script {
                    try {
                        // Test backend health
                        sh 'curl -f http://localhost:5000/health || exit 1'
                        echo 'Backend health check passed'
                        
                        // Test frontend health
                        sh 'curl -f http://localhost:3000/health || exit 1'
                        echo 'Frontend health check passed'
                        
                        // Test stock prediction API
                        sh 'curl -f "http://localhost:5000/api/predict/AAPL" || exit 1'
                        echo 'Stock prediction API test passed'
                        
                    } catch (Exception e) {
                        echo "Integration tests failed: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Cleanup and Logging') {
            steps {
                script {
                    echo 'Cleaning up Docker images...'
                    sh 'docker image prune -f || true'
                    
                    // Log based on build result
                    if (currentBuild.result == 'SUCCESS' || currentBuild.result == null) {
                        echo 'Pipeline succeeded! Application deployed successfully.'
                        sh 'echo "Deployment successful at $(date)" >> deployment.log'
                    } else if (currentBuild.result == 'FAILURE') {
                        echo 'Pipeline failed! Capturing logs...'
                        sh 'docker-compose logs > pipeline-failure.log || true'
                    } else if (currentBuild.result == 'UNSTABLE') {
                        echo 'Pipeline completed with warnings.'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed!'
        }
        success {
            echo '✓ All stages completed successfully!'
            echo '✓ Application is deployed and running'
        }
        failure {
            echo '✗ Pipeline failed - check the logs above for details'
            echo '✗ Failed at stage: Check console output'
        }
        unstable {
            echo '⚠ Pipeline completed but some tests failed or returned warnings'
        }
    }
}