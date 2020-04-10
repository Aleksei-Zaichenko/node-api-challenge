const express=require('express');
const projectDataBase = require('../helpers/projectModel.js');

const router=express.Router();

router.get('/', (req, res) => {
    projectDataBase.get()
    .then(projects => {
      if(projects.length > 0){
        res.status(200).json(projects)
      } else {
        res.status(400).json({message: 'error 400'})
      }
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({message: 'error 500'})
    })
});

router.get('/:id', validateProjectId(), (req, res) => {
    // do your magic!
    projectDataBase.get(req.params.id)
    .then(project => res.status(200).json(project))
    .catch(err => {
        consolo.log(err);
        res.status(500).json({message: "error 500"})
    }) 
});

router.post('/', (req, res) => {
    projectDataBase.insert(req.body)
    .then(newProject => {
        res.status(200).json(newProject);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({message: 'error 500'})
      })
})

router.delete('/:id', validateProjectId(), (req, res) => {
    // do your magic!
    projectDataBase.remove(req.params.id)
    .then(count =>res.status(200).json({message: `post with id:${req.params.id} was deleted`}))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'error 500'})
      })
  });
  
router.put('/:id', validateProjectId(), (req, res) => {
// do your magic!
    const changes = req.body;

    if(changes.name && changes.description){
        projectDataBase.update(req.params.id, changes)
        .then(updatedPost =>{
        if(updatedPost){
            res.status(200).json({message: `Post with id:${req.params.id} was updated successfully`})
        } else {
            res.status(500).json({message: 'Post was not updated'})
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error 500'})
          })
    } else {
        res.status(400).json({message: 'missing the text or user_id'})
    }
});

function validateProjectId(req, res, next) {
    return function(req,res,next){
      
      const postId = req.params.id;
  
      projectDataBase.get(postId)
      .then(foundProject => {
        if(foundProject){
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

module.exports = router;