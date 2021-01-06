#!/bin/bash

function dkcl(){
        CONTAINER_IDS=$(docker ps -aq)
	echo
        if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" = " " ]; then
                echo "========== Docker 컨테이너 삭제 =========="
        else
                docker rm -f $CONTAINER_IDS
        fi
	echo
}

function dkrm(){
        DOCKER_IMAGE_IDS=$(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')
	echo
        if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" = " " ]; then
		echo "========== Docker 이미지 삭제 ==========="
        else
                docker rmi -f $DOCKER_IMAGE_IDS
        fi
	echo
}

function restartNetwork() {
	echo

	docker-compose -f ./artifacts/docker-compose.yaml down
	dkcl
	dkrm

	rm -rf ./fabric-client-kv-org*

	docker-compose -f ./artifacts/docker-compose.yaml up -d
	echo
}

function installNodeModules() {
	echo
	if [ -d node_modules ]; then
		echo "============== node modules가 이미 설치되었습니다.============="
	else
		echo "============== Installing node 설치 진행중 ============="
		npm install -g
		npm rebuild -g
	fi
	echo
}

restartNetwork 
PORT=3343 node app &
node init &

