
# Optika Task Management

A basic Task Management Dashboard that allows users to create, view, update, and delete tasks. This application is built with React, NodeJS, Go, MongoDB, and Redis. 

The API provides CRUD operations for managing tasks, with caching implemented using Redis for improved performance.


## Authors

- [@bilalahmed54](https://github.com/bilalahmed54)


## Dependencies / Prerequisites
This application has dependency on `MongoDB` and `Redis Cache`. Please make sure MongoDB and Redis servers are running and accepting connection requests.

You can install client applications as well to verify connection with MongoDB and Redis Cache. It will also help to view the data being stored.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_BACKEND_BASE_URL`

A sample `.env` file is placed inside 'react-client' folder.


## Installation
This application consists of 3 main components:

    1. React Frontend
    2. NodeJS Backend
    3. Go Microservice


#### Clone repository
First of all, Clone the application code.

#### Setup React Frontend

```bash  
  cd react-client
  npm install
  npm start
```
    
#### Setup NodeJS Backend Server

```bash  
  cd node-server
  npm install
  npm start
```

#### Setup Go Microservice

```bash  
  cd go-microservice
  go mod init go-mongodb-api
  go get go.mongodb.org/mongo-driver/mongo
  go get go.mongodb.org/mongo-driver/mongo/options
  go get github.com/gorilla/mux
  
  //Run application
  go run main.go
```


## API Reference

#### Create Task

```http
  POST /api/v1/items
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | Task title |
| `description`      | `string` | Task details |
| `priority`      | `string` | Task priority: Low, Medium, High |
| `status`      | `string` | Task status: To Do, In Progress, Done |
| `deadline`      | `date` | Task deadline |

#### Create Bulk Tasks

```http
  POST /api/v1/items
```
This API taskes array of task objects to create multiple tasks in one request

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | Task title |
| `description`      | `string` | Task details |
| `priority`      | `string` | Task priority: Low, Medium, High |
| `status`      | `string` | Task status: To Do, In Progress, Done |
| `deadline`      | `date` | Task deadline |


#### Update Task

```http
  PUT /api/v1/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | Task title |
| `description`      | `string` | Task details |
| `priority`      | `string` | Task priority: Low, Medium, High |
| `status`      | `string` | Task status: To Do, In Progress, Done |
| `deadline`      | `date` | Task deadline |

#### Get all tasks

```http
  GET /api/v1/task
```

#### Get all tasks

```http
  DELETE /api/v1/task/${id}
```
