pipeline {
    agent {
        docker {
            image 'node:6-alpine'
            args '-p 3001:3001'
            }
        }
        environment {
            HOME = '.'
            CI = 'true'
        }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        
        }
    }
}