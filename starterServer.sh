#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
	export PATH=/usr/local/bin:$PATH
	cd /var/www/path/to/status/
	forever start -l statusServer.log --append -o statusServerOut.log -e statusServerError.log server.js >> /var/www/path/to/status/status-server.log 2>&1
fi