pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

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

                script {
                    env.DEPLOY_COMMIT = sh(
                        script: 'git rev-parse HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build Validation') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Deploy to VM2') {
            steps {
                sh """
                ssh ${VM2_USER}@${VM2_HOST} '
                    set -eu
                    cd ${APP_DIR} &&
                    git fetch origin develop &&
                    git checkout -f ${DEPLOY_COMMIT} &&
                    docker compose down &&
                    docker compose up -d --build &&
                    attempts=0 &&
                    until [ "\$(docker inspect --format="{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}" tutorial-nextjs-app)" = "healthy" ]; do
                        attempts=\$((attempts + 1))
                        if [ "\$attempts" -ge 20 ]; then
                            docker compose ps
                            docker compose logs app --tail=100
                            exit 1
                        fi
                        sleep 5
                    done &&
                    docker compose ps &&
                    docker compose logs app --tail=50
                '
                """
            }
        }
    }
}
