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
  }
}