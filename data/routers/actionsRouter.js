const express=require('express');
const actionDataBase = require('../helpers/actionModel.js');
const router=express.Router();

function validateActionId(req, res, next) {
    return function (req,res,next){
      
      const userId = req.params.id;
  
      actionDataBase.getById(userId)
      .then(action => {
        if(action){
          next();
        } else {
          res.status(404).json({message:'error 404'});
        }
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({message:' error 500'});
      })
    }
  }
  
  function validateUser(req, res, next) {
    return function (req,res,next){
      if(req.body){
  
        const changes = req.body;
    
        if(changes.name){
          next();
        } else {
          res.status(400).json({message: "missing required name field"})
        }} else {
          res.status(400).json({message: "missing data data"})
        }
    }
  }

module.exports = router;