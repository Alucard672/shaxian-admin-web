#!/bin/bash
# 部署管理端到测试环境（120.27.148.45）
# 域名建议：t-admin.jiyizhiyun.com（DNS A 记录指向 120.27.148.45）

set -euo pipefail

ip=120.27.148.45
user=root
deploy_dir=/web/deploy/shaxian-admin

pnpm install --frozen-lockfile
pnpm build

SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_ed25519}"
if [ ! -f "$SSH_KEY_PATH" ]; then
  echo "未找到 SSH 私钥：$SSH_KEY_PATH"
  echo "请先执行：ssh-keygen -t ed25519 -C \"shaxian-deploy\""
  exit 1
fi

SSH_OPTS="-i $SSH_KEY_PATH -o BatchMode=yes -o StrictHostKeyChecking=accept-new"

ssh $SSH_OPTS $user@$ip "mkdir -p $deploy_dir"
rsync -av --checksum --delete -e "ssh $SSH_OPTS" ./dist/ $user@$ip:$deploy_dir/
ssh $SSH_OPTS $user@$ip "chown -R nginx:nginx $deploy_dir"

echo "测试环境部署成功 → $deploy_dir"
