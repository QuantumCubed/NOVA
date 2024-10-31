FROM alpine:latest

RUN apk add --no-cache stunnel openssl

RUN mkdir -p /var/run/stunnel && chown stunnel:stunnel /var/run/stunnel

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/stunnel/private.key \
    -out /etc/stunnel/certificate.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

RUN cat /etc/stunnel/certificate.crt /etc/stunnel/private.key > /etc/stunnel/stunnel.pem && chmod 600 /etc/stunnel/stunnel.pem

COPY stunnel.conf /etc/stunnel/stunnel.conf

CMD ["stunnel", "/etc/stunnel/stunnel.conf"]