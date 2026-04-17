# EventHub

Application fullstack de gestion d'événements — Backend Node.js/TypeScript + Frontend React, déployée sur AWS EC2 avec un pipeline CI/CD Jenkins complet.

## Stack technique

- **Backend** : Node.js · TypeScript · Express.js · MongoDB
- **Frontend** : React · TypeScript · Vite
- **Reverse proxy** : Nginx
- **Tests** : Jest (backend + frontend)
- **CI/CD** : Jenkins · SonarQube · Docker · GitHub Webhooks

---

## Démarrage rapide

### Prérequis

- Docker et Docker Compose installés
- Variables d'environnement configurées (voir `eventhub_backend/.env` et `eventhub_frontend/.env`)

### Lancer l'application

```bash
./build_eventhub.sh
```

Ce script exécute `docker compose down && docker compose up -d --build` et démarre tous les services (backend, frontend, MongoDB, Nginx).

### Lancer SonarQube

```bash
docker compose -f docker-compose.sonar.yml up -d
```

SonarQube sera accessible sur `http://localhost:9000`.

---

## Tests

```bash
# Backend (depuis eventhub_backend/)
npm test -- --coverage

# Frontend (depuis eventhub_frontend/)
npm test -- --coverage
```

| | Backend | Frontend |
|---|---|---|
| Tests | 11 passants | 30 passants |
| Framework | Jest | Jest |

---

## CI/CD — Jenkins

### Infrastructure

Jenkins tourne dans un conteneur Docker sur une instance AWS EC2, avec Docker CLI installé pour builder les images depuis le pipeline.

```bash
# Lancement Jenkins (image custom avec Docker CLI)
docker run -d \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 8080:8080 \
  --name jenkins \
  my-jenkins-image
```

Le volume nommé `jenkins_home` assure la persistance de la configuration Jenkins après redémarrage.

### Pipeline (Jenkinsfile)

Le `Jenkinsfile` à la racine du dépôt définit un pipeline déclaratif déclenché automatiquement à chaque push sur `main` via un webhook GitHub.

| Stage | Description |
|---|---|
| Build | Déclenche `BuildAppJob` → exécute `build_eventhub.sh` |
| Results | Déclenche `TestEventhubJob` → vérifie l'accessibilité de l'app |
| Install deps | `npm ci` backend + frontend |
| Tests | Jest backend + frontend en parallèle avec rapport de couverture |
| SonarQube Analysis | Analyse qualité des 127 fichiers TypeScript |
| Quality Gate | Attend le résultat SonarQube via webhook |
| Docker Build | Build des images `eventhub-backend` et `eventhub-frontend` |
| Docker Push | Push sur DockerHub avec tag `:{BUILD_NUMBER}` et `:latest` |

### Webhook GitHub

Un webhook GitHub déclenche le pipeline à chaque push :

- URL : `http://51.44.137.45:8080/github-webhook/`
- Content-Type : `application/json`
- Événement : `push`

### Services sur l'instance EC2

| Service | Port |
|---|---|
| Jenkins | 8080 |
| SonarQube | 9000 |
| Application (Nginx) | 80 |
