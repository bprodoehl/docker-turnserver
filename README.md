docker-turnserver
=================

A Docker container with the Coturn STUN and TURN server (https://code.google.com/p/coturn/)

This is currently running v4.1.2.1.

```
docker run -d --name=turnserver --restart="on-failure:10" --host=net -p 3478:3478 -p 3478:3478/udp bprodoehl/turnserver
```

This will use icanhazip (http://major.io/icanhazip-com-faq/) to determine your container's public IP address. If you don't wish to use icanhazip, or you wish to use an external IP address that doesn't match what icanhazip would see, you can specify it in the environment:

```
docker run -d -e EXTERNAL_IP=1.2.3.4 --name=turnserver --restart="on-failure:10" --host=net -p 3478:3478 -p 3478:3478/udp bprodoehl/turnserver
```
