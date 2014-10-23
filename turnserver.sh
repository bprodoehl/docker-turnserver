#!/bin/bash

if [ -z $EXTERNAL_IP ]
then
    EXTERNAL_IP=`curl icanhazip.com 2> /dev/null`
fi

if [ -z $PORT ]
then
    PORT=3478
fi

if [ ! -e /tmp/turnserver.configured ]
then
    echo external-ip=$EXTERNAL_IP > /etc/turnserver.conf
    echo listening-port=$PORT >> /etc/turnserver.conf

    if [ ! -z $LISTEN_ON_PUBLIC_IP ]
    then
        echo listening-ip=$EXTERNAL_IP >> /etc/turnserver.conf
    fi

    touch /tmp/turnserver.configured
fi

exec /usr/bin/turnserver >>/var/log/turnserver.log 2>&1
