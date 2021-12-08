pipeline {
    agent any

    tools {nodejs "NodeJS 16.13"}
    
    environment {
        DEMO_SERVER = '147.172.178.30'
    }
    
    stages {

        stage('Git') {
            steps {
                cleanWs()
                git 'https://github.com/Student-Management-System/web-ide.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                // Build with base: /
                sh 'rm -f WEB-IDE-Root.tar.gz'
                sh 'npm run build -- --base-href=/ --deploy-url=/ --prod'
                sh 'tar czf WEB-IDE-Root.tar.gz dist/apps/client/'
                
                // Build with base: WEB-APP
                sh 'rm -f -r dist/'
                sh 'npm run build -- --base-href=/WEB-IDE/ --deploy-url=/WEB-IDE/ --prod'
                sh 'rm -f WEB-IDE.tar.gz'
                sh 'tar czf WEB-IDE.tar.gz dist/apps/client/'
            }
        }
        
        stage('Deploy') {
            steps {
                sh """
                    ssh -i ~/.ssh/id_rsa_student_mgmt_backend elscha@${env.DEMO_SERVER} <<EOF
                        cd /var/www/html2/WEB-IDE || exit 1
                        rm -f -r *
                        exit
                    EOF
                    scp -i ~/.ssh/id_rsa_student_mgmt_backend -r dist/apps/client/* elscha@${env.DEMO_SERVER}:/var/www/html2/WEB-IDE
                    """
            }
        }
        
        stage('Publish Results') {
            steps {
                archiveArtifacts artifacts: 'WEB-IDE*.tar.gz'
            }
        }
    }
    
    post {
        always {
             // Based on: https://stackoverflow.com/a/39178479
             load "$JENKINS_HOME/.envvars/emails.groovy" 
             step([$class: 'Mailer', recipients: "${env.elsharkawy}, ${env.klingebiel}", notifyEveryUnstableBuild: true, sendToIndividuals: false])
        }
    }
}