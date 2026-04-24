#!/bin/bash
# ================================================================
# 管理端前端 → 测试环境 部署
# 用法: cd shaxian-admin-web && bash scripts/test/deploy.sh
# ================================================================

set -euo pipefail

# -------- 配置 --------
SERVER_IP="120.27.148.45"
SERVER_USER="root"
DEPLOY_DIR=/web/deploy/shaxian-admin
# ----------------------

# SSH 连接
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_ed25519}"
if [ -f "$SSH_KEY_PATH" ]; then
    SSH_OPTS="-i $SSH_KEY_PATH -o StrictHostKeyChecking=accept-new"
else
    SSH_OPTS="-o StrictHostKeyChecking=accept-new"
fi

echo "=========================================="
echo " 管理端前端 → 测试环境"
echo " 目标: ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}"
echo "=========================================="

# [1/3] 安装依赖
echo ""
echo "[1/3] 安装依赖..."
pnpm install

# [2/3] 构建
echo ""
echo "[2/3] 构建..."
pnpm build

if [ ! -d "dist" ]; then
    echo "错误: 构建失败，dist 目录不存在"
    exit 1
fi
echo "构建完成: $(du -sh dist | awk '{print $1}')"

# [3/3] 上传
echo ""
echo "[3/3] 上传到服务器..."
ssh $SSH_OPTS $SERVER_USER@$SERVER_IP "mkdir -p $DEPLOY_DIR"
rsync -av --checksum --delete -e "ssh $SSH_OPTS" ./dist/ $SERVER_USER@$SERVER_IP:$DEPLOY_DIR
ssh $SSH_OPTS $SERVER_USER@$SERVER_IP "chown -R nginx:nginx $DEPLOY_DIR"

echo ""
echo "=========================================="
echo " 测试环境管理端部署成功！"
echo "=========================================="
