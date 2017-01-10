# Node API Starter

Base project including signup, login and jwt authentication that can be used as a starting point for ME*N-stack applications.

## Installation
````
git clone https://github.com/hfogelberg/node_api_starter depth=1 MY_APP_NAME
npm install
mongod
npm run dev
````

## Setup
1. Rename config.js.copy to config.js and edit the jwt secret key. (Config.js is in the gitignore).
2. Edit the db path in /server/db/mongoose.js
3. And set up the api! There are some good old todos as an example.
