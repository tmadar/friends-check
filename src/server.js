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
    && data.friends !== null
    && data.friends.every((entry) => {
      return typeof entry === 'number';
    })
};

app.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    return res.status(400).send({ error: true, message: 'Invalid data provided!' });
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

  friendlist.data.push(newUserData);

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
    return res.status(400).send({ error: true, message: 'Invalid data provided!' });
  }

  const user = friendlist.data.find((user) => user.id == userId);

  if (!user) {
    return res.status(404).send({ error: true, message: 'No user found with that user ID!' });
  }

  friendlist.data = friendlist.data.reduce((acc, entry) => {
    if (entry.id == userId) {
      return acc;
    }

    entry.friends = entry.friends.filter(friendIds => friendIds != userId);
    acc.push(entry);

    return acc;
  }, [])

  res.status(200).send({ success: true });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
