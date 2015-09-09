docker-turnserver
=================

A Docker container with the Coturn STUN and TURN server (https://github.com/coturn/coturn)

This is currently running v4.4.5.3.

```
docker run -d --name=turnserver --restart="on-failure:10" --net=host -p 3478:3478 -p 3478:3478/udp bprodoehl/turnserver
```

This will use icanhazip (http://major.io/icanhazip-com-faq/) to determine your container's public IP address. If you don't wish to use icanhazip, or you wish to use an external IP address that doesn't match what icanhazip would see, you can specify it in the environment:

```
docker run -d -e EXTERNAL_IP=1.2.3.4 --name=turnserver --restart="on-failure:10" --net=host -p 3478:3478 -p 3478:3478/udp bprodoehl/turnserver
```

Environment Parameters
-----------------
* SKIP_AUTO_IP -- binds to any address, useful for IPv4 and IPv6 dual-stack when also running with --net=host
* EXTERNAL_IP -- optional manually-specified external IP address
* PORT -- listening port for STUN and TURN
* LISTEN_ON_PUBLIC_IP -- bind to the external IP
* USE_IPV4 -- forces IPv4 when determining the external IP
