const express=require('express');
const actionRouter = require('./data/routers/actionsRouter.js');
const projectRouter = require('./data/routers/projectsRouter.js');
const server =express();

server.use(express.json());

server.use('/api/actions', logger(), actionRouter);

server.use('/api/projects', logger(), projectRouter);

server.get('/', logger(), (req,res) =>{
    res.send(`<h2>Node sprint!</h2>`);
});

function logger(req, res, next) {
    return function (req, res, next){
      console.log(`${req.method} Request to ${req.originalUrl} at ${new Date().toString()}`);
  
      next();
    }
  }

module.exports= server;