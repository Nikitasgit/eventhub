pipeline {
  agent any

  stages {

    stage('Preparation') {
      steps {
        script {
          try {
            sh 'docker compose down || true'
          } catch (Exception e) {
            echo "No existing containers to stop."
          }
        }
      }
    }

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
  }
}