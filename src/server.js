const friendlist = require('./friendlist.json');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const isValidCreatePayload = (data) => {
  return data !== null && typeof data === 'object'
    && data.id !== null && !isNaN(parseInt(data.id))
    && data.name !== null && typeof data.name === 'string'
    && data.friends !== null && Array.isArray(data.friends)
    && data.friends.every((entry) => {
      return typeof entry === 'number';
    })
};

const isValidUpdatePayload = (data) => {
  return data !== null && typeof data === 'object'
    && (data.name === null || typeof data.name === 'string')
    && data.friends == null || (
      Array.isArray(data.friends)
      && data.friends.every((entry) => {
        return typeof entry === 'number';
      })
    )
};

app.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    return res.status(400).send({ error: true, message: 'Invalid user ID provided!' });
  }

  const user = friendlist.data.find((user) => user.id == userId);

  if (!user) {
    return res.status(404).send({ error: true, message: 'No user found with that user ID!' });
  }

  res.status(200).send({ success: true, data: user });
});


app.post('/user', (req, res) => {
  const newUserData = req.body

  if (!isValidCreatePayload(newUserData)) {
    return res.status(400).send({ error: true, message: 'Invalid data provided!' });
  }

  const user = friendlist.data.find((user) => user.id == newUserData.id);

  if (user) {
    return res.status(409).send({ error: true, message: 'User already exists with that ID!' });
  }

  // Adds new user to the main friend list
  friendlist.data.push(newUserData);

  // Updates associations
  friendlist.data.forEach(entry => {
    if (newUserData.friends.includes(entry.id)) {
      entry.friends.push(newUserData.id)
    }
  })

  res.status(200).send({ success: true });
});

app.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    return res.status(400).send({ error: true, message: 'Invalid user ID provided!' });
  }

  const user = friendlist.data.find((user) => user.id == userId);

  if (!user) {
    return res.status(404).send({ error: true, message: 'No user found with that user ID!' });
  }

  friendlist.data = friendlist.data.reduce((acc, entry) => {
    if (entry.id == userId) { // removes user from the friend list
      return acc;
    }

    entry.friends = entry.friends.filter(friendIds => friendIds != userId); // updates assoc users' friend list to remove deleted friend
    acc.push(entry);

    return acc;
  }, [])

  res.status(200).send({ success: true });
});

app.put('/user/:userId', (req, res) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    return res.status(400).send({ error: true, message: 'Invalid user ID provided!' });
  }

  const updatingUserData = req.body

  if (!isValidUpdatePayload(updatingUserData)) {
    return res.status(400).send({ error: true, message: 'Invalid data provided!' });
  }

  const foundUser = friendlist.data.find((user) => user.id == userId);

  if (!foundUser) {
    return res.status(404).send({ error: true, message: 'No user found with that user ID!' });
  }

  friendlist.data.forEach((entry, index) => { 
    if (entry.id == userId) {
      // Updating user in the friend data list with the PUT data
      if (updatingUserData.name) {
        friendlist.data[index].name = updatingUserData.name;
      }

      if (updatingUserData.friends) {
        friendlist.data[index].friends = updatingUserData.friends
      }
    } else {
      // Updating other usesr in the friend data list
      if (updatingUserData.friends) {
        if (updatingUserData.friends.includes(entry.id) && !entry.friends.includes(foundUser.id)) { // Adding assoc friend with the updated user's ID
          friendlist.data[index].friends.push(foundUser.id);
        } else if (!updatingUserData.friends.includes(entry.id) && entry.friends.includes(foundUser.id)) { //Removing assoc friend with the updated user's ID
          friendlist.data[index].friends = entry.friends.filter((friendIds) => friendIds !== foundUser.id)
        }
      }
    }
  });

  res.status(200).send({ success: true });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
