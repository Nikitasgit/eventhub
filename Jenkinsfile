pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
       checkout scm
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

  }
}