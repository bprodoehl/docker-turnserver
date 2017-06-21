FROM phusion/baseimage:0.9.22
MAINTAINER gaoge <gaoge@learning-tech.com>

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

RUN apt-get update && apt-get dist-upgrade -y
RUN apt-get install -y gdebi-core iputils-ping

ENV COTURN_VER 4.4.5.3
RUN cd /tmp/ && curl -sL http://turnserver.open-sys.org/downloads/v${COTURN_VER}/turnserver-${COTURN_VER}-debian-wheezy-ubuntu-mint-x86-64bits.tar.gz | tar -xzv

RUN groupadd turnserver
RUN useradd -g turnserver turnserver
RUN gdebi -n /tmp/coturn*.deb

RUN mkdir /etc/service/turnserver
ADD turnserver.sh /etc/service/turnserver/run

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Python Ping
COPY requirements.txt /root/.
RUN pip install -r requirements.txt

RUN mkdir /etc/service/pythonserver
ADD pythonserver.sh /etc/service/pythonserver/run
RUN chmod +x /etc/service/pythonserver/run

COPY app.py /root/.
