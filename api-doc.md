# Kulioh API Documentation

## CLIENT Endpoints :

List of available endpoints :

> USER:
- `POST  /register` - udah
- `POST  /login` - udah
- `POST  /user/handlePayment`
- `GET    /user/profile` - udah
- `PUT    /user/profile` - udah
- `GET    /user/daily`
- `GET    /user/weekly`

> DAILY:
- `GET    /questions/daily`
- `POST  /questions/answers/daily` 
- `GET    /questions/answers/daily/:YYYYMMDD`

> TRYOUT: 
- `GET    /questions/weekly`
- `POST  /questions/answers/weekly/:YYYYMMW`

> TODOLIST:
- `GET      /todos`
- `PATCH  /todos`

&nbsp;

## POST /register

Request:

- body:
```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_
```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is already used"
}
```

&nbsp;

## POST /login

Request:

- body:
```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email/password"
}
```

&nbsp;

## POST  /user/handlePayment

Description:

Request:

- headers:
```json
{
  "access_token": "string"
}
```

- body:
```json
{
  ...
}
```

_Response (200 - OK)_
```json
{
  ...
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Payment Denied!"
}
```

## GET /user/profile

Description:

Request:

- headers:
```json
{
  "access_token": "string"
}
```

_Response (200 - Ok)_
```json
{
  "name": "string",
  ...
}
```


&nbsp;


## PUT /user/profile

Description:

Request:

- headers:
```json
{
  "access_token": "string"
}
```

- body:
```json
{
  "name":"string",  
  ...
}
```

_Response (201 - Created)_
```json
{
  "name": "string"
  ...
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "ERROR SOMETHING SOMETHING"
}
```

&nbsp;


## GET /user/daily

Description: 
- Get user all of their answered daily questions and their score

Request:

- headers:
```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_
```json
[
  {
    "subject":"string",
    "attemps": "integer",
    "correctAnswer": "integer"
  },
  ...
]
```

&nbsp;


## GET /user/weekly

Description: 
- Get user all of their answered tryouts questions, scores, and performance/rank

Request:

- headers:
```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_
```json
[
  {
    "date":"string",
    "score": "integer",
    "rank": "string"
  },
  ...
]
```

&nbsp;


## GET /questions/daily

Description: 
- Get daily question for today's date with UNSHUFFLE answer option

Request:

_Response (200 - OK)_
```json
[
  {
    "id": "integer",
    "subject":"string"
    "question": "string",
    "answers": [
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
    ],
  },
  ...
]
```

&nbsp;

## POST /questions/answers/daily

Description:
- Save user answer for today's daily question

Request:

- headers: 
```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "questionId": "integer",
  "answerId": "integer"
}
```

_Response (201 - Created)_
```json
{
  "Answer": "integer",
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "questionId or answerId did not match!"
}
```

&nbsp;

## GET /questions/answers/daily/:YYYYMMDD

Description:
- Get user answer for specific daily question dated in params with format YYYYMMDD. videoLink in response will only appear if user is premium

Request:

- headers: 
```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_
```json
{
  "id": "integer",
  "question": "string",
  "answers": [
    {"id":"integer", "answer":"opsi", "correct":true },
    {"id":"integer", "answer":"opsi"},
    {"id":"integer", "answer":"opsi"},
    {"id":"integer", "answer":"opsi"},
  ],
  "userAnser":"integer",
  "videoLink":"string"
}
```

&nbsp;

## GET /questions/weekly

Description:
- Get tryout questions for today's date with UNSHUFFLE answer option

Request:

- headers: 
```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_
```json
[
  {
    "id": "integer",
    "question": "string",
    "answers": [
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
    ],
  },
  ...
]
```

_Response (401 - Bad Request)_

```json
{
  "message": "You are already finish this tryout! To review your answer please comeback at monday and go to ??? page"
}
OR
{
  "message": "Tryout is not ready yet, please come back at ???? day - sunday!"
}
```

&nbsp;

## GET /questions/answers/weekly/:YYYYMMDD

Description:
- Get user answer for specific tryout question dated in params with format YYYYMMDD.

Request:

- headers: 
```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_
```json
[
  {
    "id": "integer",
    "question": "string",
    "answers": [
      {"id":"integer", "answer":"opsi", "correct":true },
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
      {"id":"integer", "answer":"opsi"},
    ],
    "userAnser":"integer",
  },
  ...
]
```

&nbsp;

## GET /todos

Description:
- include tasks

Request:

- headers: 
```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_
```json
[
  {
    "id":"integer"
    "status":"boolean",
    "description":"string",
    "subject":"string",
    "chapter":"string"
  }
]
```

&nbsp;

## PATCH /todos

Description:
- update user todos

Request:

- headers: 
```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "id": "integer",
  "status": "boolean"
}
```

_Response (201 - Created)_
```json
{
  "message": "success",
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "todoId did not found"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```
