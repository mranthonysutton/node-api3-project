const express = require('express');
const router = express.Router();
const Users = require('./userDb');

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
    .then(response => {
      if (response) {
        req.user = response;
        next();
      } else {
        res.status(404).json({error: "Invalid User ID."});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "Error obtaining user ID."});
    })
}

function validateUser(req, res, next) {
  // do your magic!

  if (!req.body) {
    res.status(400).json({message: "Missing user data."});
  } else if (!req.body.name) {
    res.status(400).json({message: "Missing required name field."});
  } else {
    req.user = req.body;
    next();
  }

}

function validatePost(req, res, next) {
  // do your magic!
}

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.user)
    .then(newUser => {
      res.status(201).json({...req.user, message: `Created new user: ${req.user.name}`});
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Please create a new user. That user already exists."})
    })
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Unable to obtain user information"})
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.send(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
    .then(userPosts => {
      res.status(200).json(userPosts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Error obtaining posts for the specified user ID."});
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const userToBeDeleted = [{...req.user}];

  Users.remove(req.user.id)
    .then(deletedUser => {
      res.status(200).json({...userToBeDeleted, message: "User deleted..." });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Unable to delete the specified user."})
    });
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const userInfo = req.body;
  Users.update(req.params.id, userInfo)
    .then(updatedUser => {
      res.status(200).json({id: req.params.id, ...userInfo });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Error updating the user information."})
    });
});


module.exports = router;
