pipeline {
  agent any

  tools {
    nodejs 'Node-20'
  }

  environment {
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {

    /* =========================
       1. INSTALL DEPENDENCIES
    ========================== */
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


    /* =========================
       2. TESTS UNITAIRES
    ========================== */
    stage('Tests') {
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


    /* =========================
       3. SONAR ANALYSIS
    ========================== */
    stage('SonarQube Analysis') {
      steps {
        dir('eventhub_backend') {
          withSonarQubeEnv('SonarQube') {
            sh "${tool('SonarScanner')}/bin/sonar-scanner"
          }
        }
      }
    }


    /* =========================
       4. QUALITY GATE
    ========================== */
    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }


    /* =========================
       5. DOCKER BUILD
    ========================== */
    stage('Docker Build') {
      steps {
        sh '''
          docker build -t eventhub-backend:${IMAGE_TAG} -t eventhub-backend:latest ./eventhub_backend
          docker build -t eventhub-frontend:${IMAGE_TAG} -t eventhub-frontend:latest ./eventhub_frontend
        '''
      }
    }


    /* =========================
       6. DOCKER PUSH
    ========================== */
    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {

          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

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


    /* =========================
       7. DEPLOY (DOCKER COMPOSE)
    ========================== */
    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        build job: 'BuildAppJob'
      }
    }


    /* =========================
       8. SMOKE TESTS
    ========================== */
    stage('Smoke Tests') {
      when {
        branch 'main'
      }
      steps {
        build job: 'TestEventhubJob'
      }
    }

  }


  /* =========================
     POST ACTIONS
  ========================== */
  post {
    always {
      cleanWs()
    }

    success {
      echo "Pipeline SUCCESS ✅ Image tag: ${IMAGE_TAG}"
    }

    failure {
      echo "Pipeline FAILED ❌ Check logs"
    }
  }
}