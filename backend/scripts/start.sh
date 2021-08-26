export $(cat ./env/.env.development | xargs)

nodemon -r esm ./src/server.js