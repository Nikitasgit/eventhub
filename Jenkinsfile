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
            sh '''
              sonar-scanner
            '''
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
        sh '''
          docker build -t eventhub-backend:${IMAGE_TAG} -t eventhub-backend:latest ./eventhub_backend
          docker build -t eventhub-frontend:${IMAGE_TAG} -t eventhub-frontend:latest ./eventhub_frontend
        '''
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {

          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
          '''

          sh '''
            docker tag eventhub-backend:${IMAGE_TAG} $DOCKER_USER/eventhub-backend:${IMAGE_TAG}
            docker tag eventhub-backend:latest $DOCKER_USER/eventhub-backend:latest

            docker tag eventhub-frontend:${IMAGE_TAG} $DOCKER_USER/eventhub-frontend:${IMAGE_TAG}
            docker tag eventhub-frontend:latest $DOCKER_USER/eventhub-frontend:latest

            docker push $DOCKER_USER/eventhub-backend:${IMAGE_TAG}
            docker push $DOCKER_USER/eventhub-backend:latest

            docker push $DOCKER_USER/eventhub-frontend:${IMAGE_TAG}
            docker push $DOCKER_USER/eventhub-frontend:latest
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline SUCCESS ✅ Image tag: ${IMAGE_TAG}"
    }

    failure {
      echo "Pipeline FAILED ❌ check logs"
    }
  }
}