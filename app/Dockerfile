FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Target de desarrollo: mantiene el flujo existente.
FROM base AS dev
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Target de producción: el código se actualiza desde Jenkins por SSH/rsync.
FROM base AS production
RUN apk add --no-cache openssh-server rsync \
    && npm install --global pm2 \
    && adduser -D -h /home/deploy deploy \
    && passwd -u deploy \
    && mkdir -p /home/deploy/.ssh /opt/cine-backend /run/sshd /etc/ssh/host_keys \
    && touch /home/deploy/.ssh/authorized_keys \
    && chown -R deploy:deploy /home/deploy /opt/cine-backend \
    && chmod 700 /home/deploy/.ssh \
    && chmod 600 /home/deploy/.ssh/authorized_keys \
    && printf '%s\n' \
       'PermitRootLogin no' \
       'PasswordAuthentication no' \
       'PubkeyAuthentication yes' \
       'HostKey /etc/ssh/host_keys/ssh_host_ed25519_key' \
       'AllowUsers deploy' \
       >> /etc/ssh/sshd_config

COPY docker-entrypoint.sh /usr/local/bin/cine-backend-entrypoint
RUN chmod 755 /usr/local/bin/cine-backend-entrypoint

EXPOSE 3000 22
ENTRYPOINT ["/usr/local/bin/cine-backend-entrypoint"]
