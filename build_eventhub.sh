#!/bin/bash

echo "********************************"
echo "BUILD ET DEPLOIEMENT EVENTHUB"
echo "********************************"

docker compose down
docker compose up -d --build

echo "********************************"
echo "DEPLOIEMENT TERMINE !"
date
