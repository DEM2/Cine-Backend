#!/bin/sh
set -eu

if [ -z "${SSH_PUBLIC_KEY:-}" ]; then
  echo "SSH_PUBLIC_KEY must contain the Jenkins public key" >&2
  exit 1
fi

install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
printf '%s\n' "$SSH_PUBLIC_KEY" > /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys

install -d -m 700 /etc/ssh/host_keys
if [ ! -s /etc/ssh/host_keys/ssh_host_ed25519_key ]; then
  ssh-keygen -q -t ed25519 -N '' -f /etc/ssh/host_keys/ssh_host_ed25519_key
fi
chmod 600 /etc/ssh/host_keys/ssh_host_ed25519_key
chmod 644 /etc/ssh/host_keys/ssh_host_ed25519_key.pub

node <<'NODE'
const fs = require("node:fs");
const excluded = new Set([
  "HOME",
  "USER",
  "LOGNAME",
  "SHELL",
  "PWD",
  "OLDPWD",
  "SHLVL",
  "_",
  "PATH",
  "HOSTNAME",
  "TERM",
]);
const keys = Object.keys(process.env).filter(
  (key) =>
    /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) &&
    !excluded.has(key) &&
    !key.startsWith("SSH_"),
);
const quote = (value) => "'" + value.replace(/'/g, "'\\''") + "'";
const contents = keys
  .map((key) => `export ${key}=${quote(process.env[key])}`)
  .join("\n");
fs.writeFileSync("/run/cine-backend.env", `${contents}\n`, { mode: 0o600 });
NODE
chown deploy:deploy /run/cine-backend.env
chmod 600 /run/cine-backend.env

su - deploy -c 'pm2 resurrect' || true
exec /usr/sbin/sshd -D -e
