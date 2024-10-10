FROM debian:bullseye-slim

# Installing Dependencies

RUN apt-get update && apt-get install -y \
    gcc \
    make \
    libpcre3-dev \
    zlib1g-dev\
    wget \
    cmake \
    git \
    build-essential \
    libssl-dev

# Clone BoringSSL

RUN git clone https://boringssl.googlesource.com/boringssl /usr/src/boringssl

# RUN mkdir /usr/src/boringssl/build && cd /usr/src/boringssl/build && cmake .. && make

RUN mkdir /usr/src/boringssl/build && cd /usr/src/boringssl/build && cmake -DCMAKE_INSTALL_PREFIX=../.openssl -DBUILD_SHARED_LIBS=OFF .. && make && make install

# Exporting BoringSSL Libraries -> ENV

ENV BSSL_INCLUDE_PATH=/usr/src/boringssl/include

ENV BSSL_LIB_PATH=/usr/src/boringssl/build/

# Downloading NGINX

RUN wget https://nginx.org/download/nginx-1.27.2.tar.gz

RUN tar xvf nginx-1.27.2.tar.gz && rm nginx-1.27.2.tar.gz

# Build NGINX with HTTP/3 (QUIC) & Default Modules

RUN cd nginx-1.27.2 && ./configure \
    --with-openssl=/usr/src/boringssl \
    --with-openssl-opt=enable-optimizations \
    --with-debug \
    --with-http_v3_module \
    --with-http_ssl_module \
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
    --with-stream \
#   --with-stream_quic_module \
    --with-stream_ssl_preread_module \
    --with-cc-opt="-I$BSSL_INCLUDE_PATH" \
#    --with-cc-opt="-I /usr/src/boringssl/include" \
#    --with-ld-opt="-L /usr/src/boringssl/build/ssl -L /usr/src/boringssl/build/crypto" \
    --with-ld-opt="-L$BSSL_LIB_PATH -lpthread -lssl -lcrypto" \    
    --with-pcre \
    --with-zlib=/usr/src/zlib \
    && make && make install

# Exposing ports for QUIC & HTTPS

EXPOSE 443/tcp

EXPOSE 443/udp

# Run NGINX

CMD ["nginx", "-g", "daemon off;"]