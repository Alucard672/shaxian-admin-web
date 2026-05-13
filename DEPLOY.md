# 管理端部署说明

## 部署地址

| 环境 | 服务器 IP     | 域名                   | 部署目录                  |
| ---- | ------------- | ---------------------- | ------------------------- |
| 测试 | 120.27.148.45 | t-admin.jiyizhiyun.com | /web/deploy/shaxian-admin |
| 生产 | 112.124.109.7 | admin.jiyizhiyun.com   | /web/deploy/shaxian-admin |

后端 API（同机 8080）由各自 server 块的 nginx 反代到 `/api/`，前端无需关心域名。

## 首次准备

1. **DNS**：添加 A 记录
   - `t-admin.jiyizhiyun.com` → `120.27.148.45`
   - `admin.jiyizhiyun.com` → `112.124.109.7`
2. **SSL**（仅生产）：把 `jiyizhiyun.com` 通配符证书放到 `/etc/nginx/ssl/jiyizhiyun.com.{pem,key}`
3. **Nginx 配置**：分别将 `nginx/t-admin.jiyizhiyun.com.conf` 和 `nginx/admin.jiyizhiyun.com.conf` 拷到对应服务器的 `/etc/nginx/conf.d/`，然后：
   ```bash
   nginx -t && systemctl reload nginx
   ```
4. **SSH 免密**：`ssh-copy-id root@<ip>` 配置好后，部署脚本可直接跑

## 日常发布

测试：

```bash
./deploy_test.sh
```

生产：

```bash
./deploy_prod.sh
```

脚本会执行 `pnpm build` 然后 rsync `dist/` 到服务器对应目录。

## 排错

- **登录页打不开 / 接口 404**：检查 nginx 是否生效（`/api/` 反代 + `try_files` 兜底）
- **跨域报错**：说明前端被部署到了非配置域名下，必须挂在 `*-admin.jiyizhiyun.com` 这种 nginx 配的子域上
- **刷新子页面 404**：`location /` 缺少 `try_files $uri $uri/ /index.html;`
