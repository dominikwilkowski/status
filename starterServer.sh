#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
	export PATH=/usr/local/bin:$PATH
	cd /www/status/_prod/
	forever start -l statusServer.log --append -o statusServerOut.log -e statusServerError.log server.js >> /home/deploy/.forever/statusServerRestart.log 2>&1
fi