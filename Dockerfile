FROM node:8

RUN apt-get update && apt-get --no-install-recommends --yes install \
    autoconf \
    automake \
    build-essential \
    curl \
    default-jre-headless \
    epstool \
    fig2dev \
    g++ \
    gcc \
    gdb \
    gfortran \
    ghostscript \
    gnuplot-qt \
    info \
    less \
    libtool \
    libumfpack5 \
    make \
    pstoedit \
    texinfo \
    unzip \
    xz-utils \
    zip \
    octave \
    liboctave-dev \
  && apt-get clean \
  && rm -rf \
    /tmp/hsperfdata* \
    /var/*/apt/*/partial \
    /var/lib/apt/lists/* \
    /var/log/apt/term*

COPY ./pkgs/*.tar.gz /root/octave-pkg/

WORKDIR /root/octave-pkg/
RUN octave --eval "pkg install /root/octave-pkg/control-3.1.0.tar.gz" \
    && octave --eval "pkg install /root/octave-pkg/signal-1.4.0.tar.gz" \
    && octave --eval "pkg install /root/octave-pkg/io-2.4.12.tar.gz" \
    && octave --eval "pkg install /root/octave-pkg/statistics-1.4.0.tar.gz"


CMD ["bash"]
