pipeline {
    agent any

    environment {
        GLOBAL_ENVIRONMENT = 'NO_DEPLOYMENT'
        // Need the staging properties anyway to deploy to staging and production simultaneously when doing a prod release
        DEBUG = '-vvv' //set to blank to prevent ansible debug 
        IMAGE_REPO = '151803697644.dkr.ecr.us-east-2.amazonaws.com'
        TAG = "${BRANCH_NAME}"
        HOST_TAG = ""
        ENV_TYPE = 'ECS' //"DOCKER", "ECS", "K8S" 
        IMAGE_PRIFIX = 'mp_'
        NETWORK_CONTAINER_TAG = 'my-global-net'
        DOCKER_FILE = 'Dockerfile'
        CONTAINER_PORT = '4000'
        HOST_PORT = '5858'

        ETC_HOST_NAME1 = 'localhost1'
        ETC_HOST_NAME2 = 'localhost2'
        ETC_HOST_NAME3 = 'localhost3'
        ETC_HOST_NAME4 = 'localhost4'

        ETC_HOST_IP1 = '127.0.0.11'
        ETC_HOST_IP2 = '127.0.0.12'
        ETC_HOST_IP3 = '127.0.0.13'
        ETC_HOST_IP4 = '127.0.0.14'
    }


    stages {
        stage('Setup environment') {
            steps {
                echo 'Setup environment'

                script {
                    GLOBAL_ENVIRONMENT = env.BRANCH_NAME
                    // Get tag on current branch
                    //TAG = sh(returnStdout: true, script: 'git tag --points-at HEAD')
                    echo "JOB_NAME : ${JOB_NAME}"
                    PROJ_NAME = "${JOB_NAME}".tokenize("/")
                    echo "PROJ_NAME : ${PROJ_NAME}"
                    PROJ_FOLDER = "${PROJ_NAME[0].trim()}"
                    echo "PROJ_FOLDER : ${PROJ_FOLDER}"
                    WORK_SPACE = PROJ_FOLDER
                    //***************************************************************************************
                    //MC_admin-service - remove the project prefix if no project privix comment this section.
                    PROJ_NAME = "${PROJ_FOLDER}".tokenize("_")
                    echo "PROJ_NAME : ${PROJ_NAME}"
                    PROJ_FOLDER = "${PROJ_NAME[1].trim()}"
                    //***************************************************************************************
                    HOST_TAG = "${BRANCH_NAME}".replace("_", "-")
                    echo "host_tag : ${HOST_TAG}" 
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Build ' + GLOBAL_ENVIRONMENT

                script {
                        if (GLOBAL_ENVIRONMENT == 'NO_DEPLOYMENT') {
                            echo 'This is not develop nor master branch and should not be build'
                        }
                        else {
                            build(GLOBAL_ENVIRONMENT)
                        }
                }
            }
        }

        stage('Push') {
            steps {
                echo 'Push image to ECR'

                script {
                    if (GLOBAL_ENVIRONMENT == 'NO_DEPLOYMENT') {
                        echo 'This is not develop nor master branch and should not be build'
                    }
                    else {
                        push(GLOBAL_ENVIRONMENT)
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy ' + GLOBAL_ENVIRONMENT

                script {
                    if (GLOBAL_ENVIRONMENT == 'NO_DEPLOYMENT') {
                        echo 'This is not develop nor master branch and should not be deployed'
                    }
                    else if(ENV_TYPE == 'DOCKER'){
                        deploy_on_docker(GLOBAL_ENVIRONMENT)
                    }
                    else if(ENV_TYPE == 'ECS'){
                        deploy_on_ecs(GLOBAL_ENVIRONMENT)
                    }
                    else if(ENV_TYPE == 'K8S'){
                        deploy_on_k8s(GLOBAL_ENVIRONMENT)
                    }
                    clean(GLOBAL_ENVIRONMENT)
                }
            }
        }
    }
}

def build(ENVIRONMENT) {
    echo " from build echo : ${PROJ_FOLDER} with ${DOCKER_FILE} -  ${WORK_SPACE} "
    sh "docker build -t ${WORK_SPACE} -f ${DOCKER_FILE} ."
}

def push(ENVIRONMENT) {

    sh "docker tag ${WORK_SPACE}:latest ${IMAGE_REPO}/${WORK_SPACE}:${TAG}-${BUILD_NUMBER}"
    script{
        docker.withRegistry('https://166876442188.dkr.ecr.ap-southeast-1.amazonaws.com','ecr:ap-southeast-1:aws-cli') {
            sh "docker push ${IMAGE_REPO}/${WORK_SPACE}:${TAG}-${BUILD_NUMBER}"
            sh "docker rmi ${WORK_SPACE}:latest"
            sh "docker rmi ${IMAGE_REPO}/${WORK_SPACE}:${TAG}-${BUILD_NUMBER}"
        }
    }
}

def deploy_on_docker(ENVIRONMENT) {
    sh "ansible-playbook deployment_docker.yml -i hosts.yml --tags ${PROJ_FOLDER} --extra-vars var_host=${TAG} --extra-vars docker_image_host=${IMAGE_REPO} --extra-vars docker_image_tag=${TAG}-${BUILD_NUMBER} --extra-vars docker_network=${NETWORK_CONTAINER_TAG} --extra-vars service_name=${PROJ_FOLDER} --extra-vars host_port=${HOST_PORT} --extra-vars container_port=${CONTAINER_PORT} --extra-vars docker_image_prifix=${IMAGE_PRIFIX} --extra-vars etc_host_name1=${ETC_HOST_NAME1} --extra-vars etc_host_ip1=${ETC_HOST_IP1} --extra-vars etc_host_name2=${ETC_HOST_NAME2} --extra-vars etc_host_ip2=${ETC_HOST_IP2} --extra-vars etc_host_name3=${ETC_HOST_NAME3} --extra-vars etc_host_ip3=${ETC_HOST_IP3} --extra-vars etc_host_name4=${ETC_HOST_NAME4} --extra-vars etc_host_ip4=${ETC_HOST_IP4} ${DEBUG}"
}

def deploy_on_ecs(ENVIRONMENT) {
    sh "ansible-playbook deployment_ecs.yml -i hosts.yml --tags ${PROJ_FOLDER},${WORK_SPACE}-ecs --extra-vars var_host=${TAG} --extra-vars docker_env_sufix=${HOST_TAG} --extra-vars docker_image_host=${IMAGE_REPO} --extra-vars docker_image_tag=${TAG}-${BUILD_NUMBER} --extra-vars docker_network=${NETWORK_CONTAINER_TAG} --extra-vars service_name=${PROJ_FOLDER} --extra-vars host_port=${HOST_PORT} --extra-vars container_port=${CONTAINER_PORT} --extra-vars docker_image_prifix=${IMAGE_PRIFIX} --extra-vars etc_host_name1=${ETC_HOST_NAME1} --extra-vars etc_host_ip1=${ETC_HOST_IP1} --extra-vars etc_host_name2=${ETC_HOST_NAME2} --extra-vars etc_host_ip2=${ETC_HOST_IP2} --extra-vars etc_host_name3=${ETC_HOST_NAME3} --extra-vars etc_host_ip3=${ETC_HOST_IP3} --extra-vars etc_host_name4=${ETC_HOST_NAME4} --extra-vars etc_host_ip4=${ETC_HOST_IP4} --extra-vars  ansible_python_interpreter=/usr/bin/python3 ${DEBUG}"
}

def deploy_on_k8s(ENVIRONMENT) {
    
}

def clean(ENVIRONMENT) {
    echo "Cleaning workspace "
    cleanWs()
}
