# gis_test
A Full-Stack Application with a Frontend (React) and Backend (Node.js + PostgreSQL) for Employee Cafe Management.
## Table of Contents
- Frontend
- Backend
- Technologies Used
- Setup Instructions
- Frontend Setup
- Backend Setup
- Scripts
- Folder Structure
## Frontend
### Overview
The Frontend is a React-based application for managing users and data visually. It integrates seamlessly with the backend through API calls.
### Features
- Interactive UI built with React.
- Form validation for user inputs.
- Communicates with the backend RESTful API for data operations.
## Backend
### Overview
The Backend is a Node.js application powered by Express and PostgreSQL. It provides RESTful APIs for data operations.
### Features
- API endpoints for CRUD operations.
- PostgreSQL database integration.
- Data validation using middleware.
- Secure communication with environment-based configurations.
## Technologies Used
| Technology        | Description                                                                |
| ----------------- | ------------------------------------------------------------------ |
| React | Frontend framework for UI |
| Redux | Frontend React data manupulation library |
| Material-UI	 | Component library for responsive design |
| Axios | HTTP client for API requests in frontend |
| Node.js | Backend runtime environment |
| Express | Web framework for building RESTful APIs |
| PostgreSQL | Relational database for storing application data |
## Setup Instructions
### Prerequisites
- Node.js: Download and install Node.js.
- PostgreSQL: Install and run PostgreSQL.
- npm or yarn: For managing project dependencies.
### Frontend Setup
1. Navigate to the frontend folder
```bash
  cd cafe-employee-manager
```
2. Install dependencies:
```bash
  npm install
```
3. Check Port:
- go to package.json under cafe-employee-manager
- find start:fe and check port
- current set up is 3001 and it can be changed. 
4. Check Server Port:
- go to package.json under cafe-employee-manager
- find proxy and check port and host
- current set up is 3000 and it can be changed. 
- After changed, set same port in server side one in below
5. Run the front end server:
```bash
  npm run start:fe
```
6. If don't change prot, front end will run http://localhost:3001
### Backend Setup
1. Navigate to the backend folder
```bash
  cd cafe-employee-manager-api
```
2. Install dependencies:
```bash
  npm install
```
3. Configure the environment:
```bash
DATABASE_HOST is for current database host
DATABASE_PORT is for running postgre sql running port
DATABASE_USER is for database user
DATABASE_PASSWORD is for database password
DATABASE_NAME is for create database name
DATABASE_ADMIN_USER is for datbase admin user name for creating database
DATABASE_ADMIN_PASSWORD is for datbase admin user password for creating database
DATABASE_ADMIN_NAME is for master database for creating database
PORT is current running frond end port
```
4. Seed database
```bash
  npm run seed
```
5. Run the backend end server:
```bash
  npm run start:api
```
6. If don't change prot, back end will run http://localhost:3000