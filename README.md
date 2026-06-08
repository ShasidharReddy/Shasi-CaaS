# Shasi Technologies

Shasi Technologies is a macOS-inspired cloud, DevOps, and infrastructure platform rebuilt as a Node.js + Express application with secure authentication, protected technical resources, and Docker-ready deployment workflows.

## Highlights
- Rebranded experience for **Shasi Technologies** with dark/light macOS-style themes
- Express backend with JWT auth stored in httpOnly cookies
- SQLite user database powered by `better-sqlite3`
- Protected dashboard and guide library with in-page document viewer
- Docker Hub publishing workflow with automatic version bumping and tags
- Static GitHub Pages preview for the public `src/` experience

## Project Structure
```text
Shasi-CaaS/
├── server/
│   ├── index.js
│   ├── auth.js
│   ├── middleware.js
│   ├── db.js
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── resources.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── auth.js
│   └── guides/
│       ├── linux-administration-guide.html
│       ├── kubernetes-architecture.html
│       ├── terraform-best-practices.html
│       ├── ci-cd-pipeline-design.html
│       ├── cloud-architecture-patterns.html
│       └── monitoring-and-sre.html
├── data/
├── Dockerfile
├── .dockerignore
├── .github/workflows/
│   ├── deploy.yml
│   └── pages.yml
├── VERSION
├── nginx.conf
├── clouddeploy/
│   ├── service.yaml
│   └── cloudbuild.yaml
└── README.md
```

## 📖 Deployment Guide

For **detailed step-by-step instructions** covering local dev, Docker, Docker Hub, Cloud Run, CI/CD setup, custom domains, and troubleshooting:

👉 **[docs/DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md)**

## Local Development
```bash
cd server
npm install
cd ..
node server/index.js
```

The server automatically creates `data/users.db` on first start.

## Authentication Flow
- `POST /api/auth/register` creates a user and signs them in
- `POST /api/auth/login` verifies credentials and issues a JWT cookie
- `POST /api/auth/logout` clears the session cookie
- `GET /api/auth/me` returns the active user
- Protected routes: `/dashboard`, `/resources`, `/resources/guides/*`

## Docker
The production image uses the Node.js runtime:
```bash
docker build -t shasidhar19/shasi-technologies:local .
docker run --rm -p 8080:8080 -e JWT_SECRET=change-me shasidhar19/shasi-technologies:local
```

## GitHub Actions Release Flow
On pushes to `main`, `.github/workflows/deploy.yml`:
1. Reads `VERSION`
2. Increments the patch version
3. Commits the updated VERSION file and creates a `vX.Y.Z` tag
4. Builds and pushes Docker images to Docker Hub as `shasidhar19/shasi-technologies:<version>` and `latest`
5. Publishes the static preview to GitHub Pages

Required secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Notes
- Set `JWT_SECRET` in production to override the development default.
- `data/` and `node_modules/` are gitignored.
- `nginx.conf` remains in the repository for reference only.
