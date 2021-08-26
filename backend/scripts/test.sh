export $(cat ./env/.env.test | xargs)

./node_modules/.bin/jest --runInBand --detectOpenHandles --watchAll