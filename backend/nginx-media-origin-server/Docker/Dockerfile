FROM debian:bullseye-slim

# Installing Dependencies

RUN apt-get update && apt-get install -y \
    gcc \
    make \
    libpcre3 \
    libpcre3-dev \
    zlib1g \
    zlib1g-dev\
    wget \
    cmake \
    git \
    build-essential \
    libssl-dev

# Clone BoringSSL

RUN git clone https://boringssl.googlesource.com/boringssl /usr/src/boringssl

# Build BoringSSL

RUN mkdir /usr/src/boringssl/build && \
    cd /usr/src/boringssl/build && \
    cmake -DCMAKE_BUILD_TYPE=Release \
          -DBUILD_SHARED_LIBS=0 .. && \
    make -j$(nproc)

# Create symlinks for OpenSSL compatibility

RUN cd /usr/src/boringssl/build/ssl && \
    ln -s libssl.a libssl_static.a && \
    ln -s libcrypto.a libcrypto_static.a

# Export BoringSSL Paths -> ENV

ENV BSSL_INCLUDE_PATH=/usr/src/boringssl/include

ENV BSSL_LIB_PATH=/usr/src/boringssl/build/ssl

# Downloading NGINX

RUN wget https://nginx.org/download/nginx-1.27.2.tar.gz

RUN tar xvf nginx-1.27.2.tar.gz && rm nginx-1.27.2.tar.gz

# Create NGINX Directories
RUN mkdir -p /etc/nginx /usr/share/nginx/html /var/log/nginx

# RUN sed -i 's|OPENSSL .auto/lib/openssl|OPENSSL /usr/src/boringssl|' /nginx-1.27.2/auto/lib/openssl/conf

# Build NGINX with HTTP/3 (QUIC) & Default Modules

RUN cd nginx-1.27.2 && ./configure \
   --prefix=/usr/share/nginx \
   --conf-path=/etc/nginx/nginx.conf \
#   --with-openssl=/usr/src/boringssl \
#   --with-openssl-opt=enable-optimizations \
   --with-debug \
   --with-http_v3_module \
   --with-cc-opt="-I$BSSL_INCLUDE_PATH" \
   --with-ld-opt="-L$BSSL_LIB_PATH -lssl -lcrypto -lpthread" \
#   --with-cc-opt="-I $BSSL_INCLUDE_PATH" \
#   --with-ld-opt="-L $BSSL_LIB_PATH/ssl \ 
#                  -L $BSSL_LIB_PATH/crypto" \
#   --with-http_ssl_module \
   --with-http_v2_module \
   --with-http_gzip_static_module \
   --with-http_stub_status_module \
   --with-http_realip_module \
   --with-http_addition_module \
   --with-http_sub_module \
   --with-http_dav_module \
   --with-http_flv_module \
   --with-http_mp4_module \
   --with-http_auth_request_module \
   --with-http_slice_module \
   --with-threads \
#   --with-stream \
#   --with-stream_ssl_preread_module \
#   --with-stream_quic_module \
#   --with-stream_ssl_preread_module \
   --with-pcre \
#   --with-zlib=/usr/src/zlib \
   && make && make install

# Exposing ports for QUIC & HTTPS

# Add NGINX to the system Path

ENV PATH=$PATH:/usr/share/nginx/sbin

EXPOSE 443/tcp

EXPOSE 443/udp

# COPY NGINX Docker Init Scripts

COPY ./docker-entrypoint.sh /

#COPY ./scripts/ /docker-entrypoint.d/

RUN mkdir docker-entrypoint.d && cp /nginx-1.27.2/html/* /usr/share/nginx/html/

COPY ./scripts/10-listen-on-ipv6-by-default.sh /docker-entrypoint.d

COPY ./scripts/15-local-resolvers.envsh /docker-entrypoint.d

COPY ./scripts/20-envsubst-on-templates.sh /docker-entrypoint.d

COPY ./scripts/30-tune-worker-processes.sh /docker-entrypoint.d

#COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN chmod +x docker-entrypoint.sh && chmod +x docker-entrypoint.d/*

# Symbolic link to print logs to stdout and stderr

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Entrypoint

ENTRYPOINT ["/docker-entrypoint.sh"]

# Run NGINX

CMD ["nginx", "-g", "daemon off;"]

#CMD ["nginx", "-g", "daemon off;"]