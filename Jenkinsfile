pipeline {
  agent any

  tools {
    nodejs 'Node-20'
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

    stage('Install deps') {
      steps {
        sh 'node -v && npm -v'
        dir('eventhub_backend') {
          sh '''
            if [ -f package-lock.json ]; then
              npm ci --include=dev
            else
              npm install --include=dev
            fi
          '''
        }
        dir('eventhub_frontend') {
          sh '''
            if [ -f package-lock.json ]; then
              npm ci --include=dev
            else
              npm install --include=dev
            fi
          '''
        }
      }
    }

    stage('Start MongoDB') {
      steps {
        sh '''
          docker rm -f mongo-test 2>/dev/null || true
          docker run -d --name mongo-test -p 27017:27017 mongo:6
          echo "Waiting for Mongo to accept connections..."
          for i in $(seq 1 90); do
            if docker exec mongo-test mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null | grep -q 1; then
              echo "Mongo is ready (after ${i}s)"
              exit 0
            fi
            sleep 1
          done
          echo "Mongo did not become ready in time"
          exit 1
        '''
      }
    }

    stage('Tests') {
      steps {
        script {
          def mongoHost = sh(
            script: '''#!/bin/bash
# Jenkins agent in Docker: published ports are on the host, use default gateway (not localhost).
if [ -f /.dockerenv ]; then
  H=$(ip route show default 2>/dev/null | awk '/default/ {print $3}' | head -1)
  if [ -z "$H" ]; then H=172.17.0.1; fi
  echo -n "$H"
else
  echo -n "127.0.0.1"
fi
''',
            returnStdout: true
          ).trim()
          if (!mongoHost) {
            mongoHost = "127.0.0.1"
          }
          env.MONGO_URI = "mongodb://${mongoHost}:27017/eventhub_integration_test"
          echo "Tests will use MONGO_URI=${env.MONGO_URI}"
        }
        withEnv(["MONGO_URI=${env.MONGO_URI}"]) {
          parallel {
            stage('Backend tests') {
              steps {
                dir('eventhub_backend') {
                  sh 'npm test -- --coverage --ci'
                }
              }
            }
            stage('Frontend tests') {
              steps {
                dir('eventhub_frontend') {
                  sh 'npm test -- --coverage --ci'
                }
              }
            }
          }
        }
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
    always {
      sh 'docker rm -f mongo-test 2>/dev/null || true'
    }

    success {
      echo "Pipeline SUCCESS ✅ Image tag: ${IMAGE_TAG}"
    }

    failure {
      echo "Pipeline FAILED ❌ check logs"
    }
  }
}