# Production-Grade Cloud Infrastructure & DevOps Platform

A simple 3-tier Task Manager (frontend + REST API + PostgreSQL) used as the base
for a Linux / AWS / Docker / CI-CD / Terraform / Ansible / Kubernetes / Monitoring project.

## Architecture
Browser -> Nginx (frontend) -> Node/Express API -> PostgreSQL

## Run locally
```bash
docker compose up --build
```
Open http://localhost:8080

## API
| Method | Path | Purpose |
| --- | --- | --- |
| GET | /health | Health check |
| GET | /api/tasks | List tasks |
| POST | /api/tasks | Create task `{ "title": "..." }` |
| PUT | /api/tasks/:id | Toggle done |
| DELETE | /api/tasks/:id | Delete task |

## Roadmap
- [x] Phase 1: Application
- [x] Phase 5: Docker (basic)
- [ ] Terraform, Ansible, Kubernetes, CI/CD, Prometheus + Grafana
