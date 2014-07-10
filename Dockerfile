FROM phusion/baseimage
MAINTAINER Brian Prodoehl <bprodoehl@connectify.me>

# Set correct environment variables.
ENV HOME /root

# Regenerate SSH host keys. baseimage-docker does not contain any, so you
# have to do that yourself. You may also comment out this instruction; the
# init system will auto-generate one during boot.
RUN /etc/my_init.d/00_regen_ssh_host_keys.sh

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

RUN apt-get update
RUN apt-get install -y gdebi-core

RUN cd /tmp/ && curl -sL http://turnserver.open-sys.org/downloads/v4.0.1.3/turnserver-4.0.1.3-debian-wheezy-ubuntu-mint-x86-64bits.tar.gz | tar -xzv

RUN groupadd turnserver
RUN useradd -g turnserver turnserver
RUN gdebi -n /tmp/coturn*.deb

RUN mkdir /etc/service/turnserver
ADD turnserver.sh /etc/service/turnserver/run

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

