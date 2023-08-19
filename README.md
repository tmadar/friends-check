# friends-check

## Starting application

Build the docker container. Run `docker build . -t 'friends-check'`

Run the tagged docker container that was just built. Run `docker run -p 3000:3000 -d friends-check`

## Data

Pre-generated list can be found in `src/friendlist.json`

## Endpoints

### GET '/user/:userId'

Gets the user based off of their ID.

Example responses:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Ron Weasley",
        "friends": [
            0,
            2
        ]
    }
}
```

```json
{
    "error": true,
    "message": "Invalid user ID provided!"
}
```

```json
{
    "error": true,
    "message": "No user found with that user ID!"
}
```

### POST '/user'

Insert new user to the dataset. 

The following attributes are required for the data body otherwise you will receive an error:
```
{
    id: number;
    name: string;
    friends: number[];
}
```

Example POST body:
```json
{
    "id": 4,
    "name": "Albus Dumbledor",
    "friends": [0, 1, 2]
}
```

Example responses:
```json
{
    "success": true
}
```

```json
{
    "error": true,
    "message": "Invalid data provided!"
}
```

```json
{
    "error": true,
    "message": "User already exists with that ID!"
}
```

### DELETE '/user/:userId'

Remove the user from the dataset and update other associations to them.

Example responses:
```json
{
    "success": true
}
```

```json
{
    "error": true,
    "message": "No user found with that user ID!"
}
```

```json
{
    "error": true,
    "message": "Invalid user ID provided!"
}
```

### PUT '/user/:userId'

Updates the user's info and updates the friendlist if necessary.

The following attributes are supported for the data body:
```
{
    name?: string;
    friends?: number[];
}
```

Example PUT body:
```json
{
    "name": "Albus Dumbledor",
    "friends": [1, 2]
}
```

Example responses
```json
{
    "success": true
}
```

```json
{
    "error": true,
    "message": "Invalid user ID provided!"
}
```

```json
{
    "error": true,
    "message": "No user found with that user ID!"
}
```

```json
{
    "error": true,
    "message": "Invalid data provided!"
}
```
