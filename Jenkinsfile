pipeline {
    agent any
    stages {
        stage("Checkout") {
            steps {
                echo "Code checkout done"
                checkout scm
            }
        }
        stage("Deploy to K8s") {
            steps {
                echo "Deploying to Kubernetes..."
                sh "kubectl rollout restart deployment/backend -n univera"
                sh "kubectl rollout status deployment/backend -n univera --timeout=120s"
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