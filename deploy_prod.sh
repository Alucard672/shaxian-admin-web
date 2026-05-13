#!/bin/bash
# 部署管理端到生产环境（112.124.109.7）
# 域名：admin.jiyizhiyun.com

set -euo pipefail

ip=112.124.109.7
user=root
deploy_dir=/web/deploy/shaxian-admin

read -p "确认部署到生产环境 $ip ? [y/N] " ans
[[ "$ans" == "y" || "$ans" == "Y" ]] || { echo "已取消"; exit 1; }

pnpm install --frozen-lockfile
pnpm build

SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_ed25519}"
if [ ! -f "$SSH_KEY_PATH" ]; then
  echo "未找到 SSH 私钥：$SSH_KEY_PATH"
  exit 1
fi

SSH_OPTS="-i $SSH_KEY_PATH -o BatchMode=yes -o StrictHostKeyChecking=accept-new"

ssh $SSH_OPTS $user@$ip "mkdir -p $deploy_dir"
rsync -av --checksum --delete -e "ssh $SSH_OPTS" ./dist/ $user@$ip:$deploy_dir/
ssh $SSH_OPTS $user@$ip "chown -R nginx:nginx $deploy_dir"

echo "生产环境部署成功 → $deploy_dir"
