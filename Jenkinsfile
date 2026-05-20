pipeline {
    agent any

    environment {
        APP_DIR = "/home/staging-dev/project_devops/tutorial-devops-nextjs"
        VM2_HOST = "172.16.113.192"
        VM2_USER = "staging-dev"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'develop',
                url: 'https://github.com/Soermin/tutorial-devops-nextjs.git'
            }
        }

        stage('Build Validation') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Deploy to VM2') {
            steps {
                sh """
                ssh ${VM2_USER}@${VM2_HOST} '
                    cd ${APP_DIR} &&
                    git pull origin develop &&
                    docker compose down &&
                    docker compose up -d --build
                '
                """
            }
        }
    }
}