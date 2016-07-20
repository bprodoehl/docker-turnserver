#!/bin/bash

if [ -z $SKIP_AUTO_IP ] && [ -z $EXTERNAL_IP ]
then
    if [ ! -z USE_IPV4 ]
    then
        EXTERNAL_IP=`curl -4 icanhazip.com 2> /dev/null`
    else
        EXTERNAL_IP=`curl icanhazip.com 2> /dev/null`
    fi
fi

if [ -z $PORT ]
then
    PORT=3478
fi

if [ ! -e /tmp/turnserver.configured ]
then
    if [ -z $SKIP_AUTO_IP ]
    then
        echo external-ip=$EXTERNAL_IP > /etc/turnserver.conf
    fi
    echo listening-port=$PORT >> /etc/turnserver.conf

    if [ ! -z $LISTEN_ON_PUBLIC_IP ]
    then
        echo listening-ip=$EXTERNAL_IP >> /etc/turnserver.conf
    fi

    touch /tmp/turnserver.configured
fi


if [ ! -z $ENABLE_SSL ]
then
    if [ ! -z $SSL_CRT_FILE]
    then
        echo cert=$SSL_CRT_FILE >> /etc/turnserver.conf
    else
        echo cert=/etc/cert/server.crt >> /etc/turnserver.conf
    fi
    
    if [ ! -z $SSL_CRT_FILE]
    then
        echo pkey=$SSL_CRT_FILE >> /etc/turnserver.conf
    else
        echo pkey=/etc/cert/server.key >> /etc/turnserver.conf
    fi
fi

if [ ! -z $ENABLE_SQLITE ]
then
    echo userdb=/var/lib/turn/turndb >> /etc/turnserver.conf
fi

if [ ! -z $ENABLE_MOBILITY ]
then
    echo mobility >> /etc/turnserver.conf
fi

if [ ! -z $USERNAME ] && [ ! -z $PASSWORD ]
then
    echo lt-cred-mech >> /etc/turnserver.conf
    echo user=$USERNAME:$PASSWORD >> /etc/turnserver.conf
fi

if [ ! -z $REALM ]
then
    echo realm=$REALM >> /etc/turnserver.conf
fi

if [ ! -z $STATIC_AUTH_SECRET ]
then
    echo static-auth-secret=$STATIC_AUTH_SECRET >> /etc/turnserver.conf
fi

exec /usr/bin/turnserver --no-cli -l stdout
