#!/bin/bash

echo "******************************"
echo "BUILD ET DEPLOIEMENT EVENTHUB"
echo "******************************"

# Arrête les anciens conteneurs
docker compose down

# Reconstruit et relance l’app
docker compose up -d --build

echo "******************************"
echo "DEPLOIEMENT TERMINE !"
date
