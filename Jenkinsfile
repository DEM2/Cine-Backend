pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        APP_DIR = 'app'
        SSH_PORT = '22'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar, probar y compilar') {
            steps {
                dir("${APP_DIR}") {
                    sh '''
                        set -eu
                        npm ci
                        npm test -- --runInBand
                        npm run build
                    '''
                }
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
