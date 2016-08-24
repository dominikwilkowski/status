#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
	export PATH=/usr/local/bin:$PATH
	cd /www/status/
	forever start -l status.log --append -o statusOut.log -e statusError.log server.js >> /home/deploy/.forever/statusRestart.log 2>&1
fi