FROM jenkins/jenkins:lts-jdk21


# ============================================================
# PLUGINS
# ============================================================

USER root


RUN jenkins-plugin-cli \
    --plugins \
        git \
        workflow-aggregator \
        ssh-agent \
        sonar


# ============================================================
# SYSTEM DEPENDENCIES
# ============================================================

RUN apt-get update && \
    apt-get install -y \
        git \
        openssh-client \
        rsync \
        curl \
        ca-certificates \
        unzip \
        && \
    rm -rf /var/lib/apt/lists/*


# ============================================================
# NODE.JS 22
# ============================================================

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs


# ============================================================
# VERIFICATION
# ============================================================

RUN echo "==========================================" && \
    echo " JENKINS BUILD ENVIRONMENT" && \
    echo "==========================================" && \
    echo "" && \
    echo "Node:" && \
    node --version && \
    echo "" && \
    echo "NPM:" && \
    npm --version && \
    echo "" && \
    echo "Git:" && \
    git --version && \
    echo "" && \
    echo "Rsync:" && \
    rsync --version | head -n 1 && \
    echo "" && \
    echo "SSH:" && \
    ssh -V


# ============================================================
# JENKINS USER
# ============================================================

USER jenkins