const express=require('express');
const actionDataBase = require('../helpers/actionModel.js');
const projectDataBase = require('../helpers/projectModel.js');

const router=express.Router();

router.get('/', (req, res) => {
    actionDataBase.get()
    .then(actions => {
      if(actions.length > 0){
        res.status(200).json(actions)
      } else {
        res.status(400).json({message: 'error 400'})
      }
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({message: 'error 500'})
    })
});

router.get('/:id', validateActionId(), (req, res) => {
    // do your magic!
    actionDataBase.get(req.params.id)
    .then(action => res.status(200).json(action))
    .catch(err => {
        consolo.log(err);
        res.status(500).json({message: "error 500"})
    }) 
});

router.post('/', validateProjectId(), validateNewAction(), (req, res) => {
    actionDataBase.insert(req.body)
    .then(newAction => {
        res.status(200).json(newAction);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({message: 'error 500'})
      })
})

router.delete('/:id', validateActionId(), (req, res) => {
    // do your magic!
    actionDataBase.remove(req.params.id)
    .then(count =>res.status(200).json({message: `Action with id:${req.params.id} was deleted`}))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'error 500'})
      })
  });
  
router.put('/:id', validateActionId(), (req, res) => {
// do your magic!
    const changes = req.body;

    if(changes.project_id || changes.description || changes.notes || changes.completed){
        actionDataBase.update(req.params.id, changes)
        .then(updatedAction=>{
        if(updatedAction){
            res.status(200).json({message: `Action with id:${req.params.id} was updated successfully`})
        } else {
            res.status(500).json({message: 'Action was not updated'})
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error 500'})
          })
    } else {
        res.status(400).json({message: 'missing what to change'})
    }
});

function validateActionId(req, res, next) {
    return function (req,res,next){
      
      const actionId = req.params.id;
  
      actionDataBase.get(actionId)
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
  
function validateNewAction(req, res, next) {
    return function (req,res,next){
        if(req.body){

            const changes = req.body;

            if(changes.project_id && changes.description && changes.notes){
                next();
            } else {
                res.status(400).json({message: "missing one of required fields"})
            }
        } else {
            res.status(400).json({message: "missing data"})
        }
    }
}

function validateProjectId(req, res, next) {
    return function(req,res,next){
      
      const projectId = req.body.project_id;
  
      projectDataBase.get(projectId)
      .then(foundProject => {
        if(foundProject){
          next();
        } else {
          res.status(404).json({message:`error 404. No project with id:${projectId} exist`});
        }
      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({message:' error 500'});
      })
    }
}

module.exports = router;