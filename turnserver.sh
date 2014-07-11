#!/bin/bash

${EXTERNAL_IP:=`curl icanhazip.com 2> /dev/null`}

if [ ! -e /tmp/turnserver.configured ]
then
    echo external-ip=$EXTERNAL_IP > /etc/turnserver.conf
    touch /tmp/turnserver.configured
fi

exec /usr/bin/turnserver >>/var/log/turnserver.log 2>&1
