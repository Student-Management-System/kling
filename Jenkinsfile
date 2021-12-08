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
                git 'https://github.com/Student-Management-System/StudentMgmt-Client.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                // Build with base = WEB-APP
                sh 'ng build --base-href=/WEB-APP/ --deploy-url=/WEB-APP/ --prod'
                sh 'rm -f Client.tar.gz'
                sh 'tar czf Client.tar.gz dist/student-mgmt-client/'
                
                // Build with base = /
                sh 'rm -f -r dist/'
                sh 'rm -f Client-Root.tar.gz'
                sh 'ng build --prod'
                sh 'tar czf Client-Root.tar.gz dist/student-mgmt-client/'
            }
        }
        
        stage('Deploy') {
            steps {
                sshagent(credentials: ['Stu-Mgmt_Demo-System']) {
                    sh """
                        [ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh
                        ssh-keyscan -t rsa,dsa example.com >> ~/.ssh/known_hosts
                        ssh -i ~/.ssh/id_rsa_student_mgmt_backend elscha@${env.DEMO_SERVER} <<EOF
                            cd /var/www/html2/WEB-APP || exit 1
                            rm -f -r *
                            exit
                        EOF
                        scp -i ~/.ssh/id_rsa_student_mgmt_backend -r dist/student-mgmt-client/* elscha@${env.DEMO_SERVER}:/var/www/html2/WEB-APP
                        """
                }
            }
        }
        
        stage('Publish Results') {
            steps {
                archiveArtifacts artifacts: '*.tar.gz'
            }
        }
    }
}