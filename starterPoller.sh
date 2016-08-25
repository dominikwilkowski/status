#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
	export PATH=/usr/local/bin:$PATH
	cd /www/status/_prod/
	forever start -l statusPoller.log --append -o statusPollerOut.log -e statusPollerError.log poller.js >> /home/deploy/.forever/statusPollerRestart.log 2>&1
fi