pipeline {
  agent any

  tools {
      nodejs 'Node-18'
  }

  environment {
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Build') {
      steps {
        build job: 'BuildAppJob'
      }
    }

    stage('Results') {
      steps {
        build job: 'TestEventhubJob'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        dir('eventhub_backend') {
          withSonarQubeEnv('SonarQube') {
            sh "${tool('SonarScanner')}/bin/sonar-scanner"
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t eventhub-backend:${IMAGE_TAG} ./eventhub_backend"
        sh "docker build -t eventhub-backend:latest ./eventhub_backend"

        sh "docker build -t eventhub-frontend:${IMAGE_TAG} ./eventhub_frontend"
        sh "docker build -t eventhub-frontend:latest ./eventhub_frontend"
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            
            sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"

            sh "docker tag eventhub-backend:${IMAGE_TAG} $DOCKER_USER/eventhub-backend:${IMAGE_TAG}"
            sh "docker tag eventhub-backend:latest $DOCKER_USER/eventhub-backend:latest"

            sh "docker tag eventhub-frontend:${IMAGE_TAG} $DOCKER_USER/eventhub-frontend:${IMAGE_TAG}"
            sh "docker tag eventhub-frontend:latest $DOCKER_USER/eventhub-frontend:latest"

            sh "docker push $DOCKER_USER/eventhub-backend:${IMAGE_TAG}"
            sh "docker push $DOCKER_USER/eventhub-backend:latest"

            sh "docker push $DOCKER_USER/eventhub-frontend:${IMAGE_TAG}"
            sh "docker push $DOCKER_USER/eventhub-frontend:latest"
        }
      }
    }

  }
}