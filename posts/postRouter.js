const express = require('express');

const router = express.Router();
const Posts = require("./postDb");

// custom middleware
// Checks if the postID being passed through exists, if found, returns the object back so that it can be displayed to the client, else, displays 404 error
function validatePostId(req, res, next) {
  // do your magic!
  Posts.getById(req.params.id)
    .then(post => {
      if (post) {
        req.response = post;
        next();
      } else {
        res.status(400).json({message: "The specified post ID does not exist."})
      }
    })
    .catch(error => {
      console.log(error);
    });
}

router.get('/', (req, res) => {
  // do your magic!
  Posts.get()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Unable to retrieve posts"});
    });
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  res.send(req.response);
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  const postToBeDeleted = [{...req.response}];

  Posts.remove(req.response.id)
    .then(deletedPost => {
      res.status(200).json(postToBeDeleted);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Unable to delete the specified post."});
    });

});

router.put('/:id', validatePostId, (req, res) => {
  res.send('Still working')
});

module.exports = router;
