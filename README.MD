# DevTinder 🚀

A full-stack MERN application that helps developers connect, network, and collaborate with other developers.

## Features

* User Authentication (JWT)
* Login & Signup
* Developer Profile Management
* Send Connection Requests
* Accept/Reject Requests
* View Connections
* Developer Feed
* Secure Password Hashing with bcrypt
* Responsive UI

## Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router DOM
* Axios
* Tailwind CSS / DaisyUI

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

## Project Structure

```text
Devtinder/
├── backend/
├── frontend/
├── apiList.md
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/Devtinder.git
cd Devtinder
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside `backend`:

```env
PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## API Endpoints

### Authentication

* POST /signup
* POST /login
* POST /logout

### Profile

* GET /profile/view
* PATCH /profile/edit

### Requests

* POST /request/send/:status/:userId
* POST /request/review/:status/:requestId

### User

* GET /user/connections
* GET /user/requests/received
* GET /feed

## Future Enhancements

* Real-time Chat
* Notifications
* Search and Filters
* GitHub Integration
* Email Verification
* Dark Mode


