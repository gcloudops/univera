pipeline {
    agent any
    environment {
        IMAGE_NAME = "univera/backend"
        NAMESPACE = "univera"
    }
    stages {
        stage("Checkout") {
            steps {
                echo "Code GitHub varon gheto..."
                checkout scm
            }
        }
        stage("Docker Build") {
            steps {
                echo "Docker image build kartो..."
                sh "docker build -t univera/backend:latest ./backend"
            }
        }
        stage("Deploy to K8s") {
            steps {
                echo "Kubernetes madhe deploy kartो..."
                sh "kubectl rollout restart deployment/backend -n univera"
            }
        }
        stage("Health Check") {
            steps {
                echo "Health check..."
                sh "kubectl get pods -n univera -l app=backend"
            }
        }
    }
    post {
        success { echo "Deployment successful!" }
        failure { echo "Deployment failed!" }
    }
}