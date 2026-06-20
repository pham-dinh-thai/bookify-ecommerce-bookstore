# Security Guide

Production security hardening applied to this deployment.

## Docker Compose (docker-compose.prod.yaml)

- **Non-root users**: `backend_app` and `frontend_app` run as `node` (UID 1000)
- **Read-only root filesystem**: prevents container escape via filesystem writes
- **no-new-privileges**: blocks privilege escalation inside containers
- **tmpfs /tmp**: writable temp directory for Node.js compatibility
- **Cloudflare Tunnel**: origin IP hidden, DDoS/WAF handled at edge
- **No exposed DB ports**: MySQL (3306) and Redis (6379) are internal only
- **All containers** have `restart: unless-stopped`

## Nginx (nginx/nginx.conf)

- `server_tokens off` — hides nginx version
- Blocks dot files (`~ /\.`) and `/public/` paths
- Rate limiting:
  - `/api`: 30 req/s, burst 50
  - `/`: 100 req/s, burst 200
- Upload serving (`/uploads/`):
  - `X-Content-Type-Options: nosniff` — prevents MIME sniffing
  - `default_type application/octet-stream` — forces download, not render
- Security headers (all responses):
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- Access log enabled (combined format, buffered)
- `client_max_body_size 20M` — limits request body

## File Upload (backend)

- Magic byte detection (`file-type`) — prevents MIME spoofing
- Filename sanitization — strips unsafe characters, UUID prefix prevents collision
- MIME allowlist: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`, `text/plain`
- Max file size: 5 MB (enforced at Multer and value object level)

## UFW Firewall

- Default incoming policy: **deny**
- Allow only: Cloudflare IP ranges (port 80) + SSH (port 2222)
- Enable: `sudo ufw --force enable`

## SSH Hardening

- Port changed to **2222**
- Password authentication disabled
- Root login disabled
- Public key authentication only

## Maintenance

### Update Cloudflare IP ranges

```bash
curl -s https://www.cloudflare.com/ips-v4 | while read ip; do sudo ufw allow from "$ip" to any port 80 proto tcp; done
curl -s https://www.cloudflare.com/ips-v6 | while read ip; do sudo ufw allow from "$ip" to any port 80 proto tcp; done
```

### Upload directory permissions

The `./storage/uploads` directory must be writable by UID 1000:

```bash
sudo chown -R 1000:1000 ./storage/uploads
```
