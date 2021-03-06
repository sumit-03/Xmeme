#!/bin/bash

# mongodb installation
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt-get update

sudo apt-get install -y mongodb-org

sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
chown mongodb:mongodb /tmp/mongodb-27017.sock

sudo systemctl start mongod



# node installation
sudo apt-get install -y nodejs

sudo apt-get install -y npm

sudo npm install -g npm@7.5.4