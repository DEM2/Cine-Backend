pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        APP_DIR = 'app'
        SSH_PORT = '22'
        HUSKY = '0'
        SONAR_SERVER = 'SonarQube'
        SONAR_SCANNER_TOOL = 'SonarQubeScanner1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh '''
                    set -eu
                    npm ci --ignore-scripts
                    npm --prefix "${APP_DIR}" ci
                '''
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Coverage') {
            steps {
                sh 'npm run coverage'
            }
        }

        stage('SonarQube') {
            steps {
                script {
                    def scannerHome = tool env.SONAR_SCANNER_TOOL

                    withSonarQubeEnv(env.SONAR_SERVER) {
                        withEnv(["SCANNER_HOME=${scannerHome}"]) {
                            sh '''
                                set -eu
                                "${SCANNER_HOME}/bin/sonar-scanner" \\
                                  -Dproject.settings=sonar-project.properties \\
                                  -Dsonar.host.url="${SONAR_HOST_URL}" \\
                                  -Dsonar.token="${SONAR_AUTH_TOKEN}"
                            '''
                        }
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

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Desplegar por SSH') {
            steps {
                script {
                    def sshHost = env.DEPLOY_HOST ?: 'app'
                    def sshUser = env.DEPLOY_USER ?: 'deploy'
                    def deployPath = env.DEPLOY_PATH ?: '/opt/cine-backend'
                    def appName = env.PM2_APP_NAME ?: 'cine-backend'
                    def credentialId = env.SSH_CREDENTIAL_ID ?: 'cine-backend-deploy-ssh'

                    sshagent(credentials: [credentialId]) {
                        withEnv([
                            "SSH_HOST=${sshHost}",
                            "SSH_USER=${sshUser}",
                            "DEPLOY_PATH=${deployPath}",
                            "APP_NAME=${appName}"
                        ]) {
                            dir("${APP_DIR}") {
                                sh '''
                                    set -eu
                                    SSH_CMD="ssh -p ${SSH_PORT} -o BatchMode=yes -o StrictHostKeyChecking=accept-new"

                                    rsync -az --delete \\
                                      --exclude=node_modules/ \\
                                      --exclude=.git/ \\
                                      --exclude='.env*' \\
                                      --exclude=coverage/ \\
                                      -e "$SSH_CMD" \\
                                      ./ "${SSH_USER}@${SSH_HOST}:${DEPLOY_PATH}/"

                                    $SSH_CMD "${SSH_USER}@${SSH_HOST}" \\
                                                  ". /run/cine-backend.env && \\
                                                    cd '${DEPLOY_PATH}' && \\
                                       npm ci --omit=dev && \\
                                       if pm2 describe '${APP_NAME}' >/dev/null 2>&1; then \\
                                         pm2 restart '${APP_NAME}' --update-env; \\
                                       else \\
                                         pm2 start npm --name '${APP_NAME}' -- start; \\
                                       fi && \\
                                       pm2 save"
                                '''
                            }
                        }
                    }
                }
            }
        }
    }
}
