# MARS DOODLE
![image](https://github.com/samjain233/doodle/assets/94921996/8fbdb11a-78b4-4665-b65d-b1e6f09b3028)

Welcome to our Real-Time Drawing and Guessing Web App Game! This project, built with Next.js, Node.js, Socket.io, and MongoDB, provides an interactive and engaging experience for users who love to draw and guess in real-time. With a range of features, including multiplayer support, chat functionality, and advanced drawing tools, this web app aims to create a fun and dynamic environment for players.

## Tech Stacks

- [Next.js](https://nextjs.org/): A React framework for building server-rendered and statically generated web applications.

- [Node.js](https://nodejs.org/): A JavaScript runtime built on Chrome's V8 JavaScript engine.

- [Socket.io](https://socket.io/): A library for real-time web applications. It enables real-time, bidirectional, and event-based communication.

- [MongoDB](https://www.mongodb.com/): A NoSQL database for storing and managing data.

## Dependencies

- [@dicebear/collection](https://www.npmjs.com/package/@dicebear/collection): A library for generating avatars.
- [next-auth](https://next-auth.js.org/): Authentication for Next.js applications.
- [randomstring](https://www.npmjs.com/package/randomstring): A library for generating random strings.
- [react-hot-toast](https://react-hot-toast.com/): A React toast notification library.
- [react-icons](https://react-icons.github.io/react-icons/): A library of icons for React applications.
- [react-loader-spinner](https://www.npmjs.com/package/react-loader-spinner): A React component for providing loading spinners.
- [roughjs](https://roughjs.com/): A library for creating hand-drawn-like graphics.

## Features

### 1. Multiplayer Drawing and Guessing
![image](https://github.com/samjain233/doodle/assets/94921996/1c098b7e-e2f3-4c3c-a62d-f89ab0da6d0c)

- Experience real-time drawing and guessing with friends or other players.
- One player draws a word while others try to guess it.

### 2. Multiplayer Support
- Enjoy multiplayer functionality, allowing users to join public rooms or create private ones.
- Invite friends using unique links for a seamless gaming experience.

### 3. In-Game Chat
- Communicate with other players through an in-game chat feature.
- Enhance the gaming experience with real-time conversations.

### 4. User Authentication and Profile Management
![image](https://github.com/samjain233/doodle/assets/94921996/9a20ed34-e243-42c6-8789-808b905e0b2e)

- Create personalized profiles and track your game history.
- User can be authenticated using google, discord and github.

### 5. Drawing Tools
![image](https://github.com/samjain233/doodle/assets/94921996/24cad121-e2da-4e24-a76c-5116107d7958)

- Choose from different pen colors and brush sizes.
- Utilize features like eraser, bucket fill, and color picker.

### 6. Save Current Drawing
- Save your masterpiece at any point during the drawing session.

### 7. Room Administration
![image](https://github.com/samjain233/doodle/assets/94921996/18fcdf6c-b06a-4eef-8208-492d53498ba7)

- Assign a user as the room admin with the power to kick users and make others admins.
- Chat restrict a user without kicking them for better moderation.

### 8. Undo and Redo
![image](https://github.com/samjain233/doodle/assets/94921996/8040ac1d-b7da-4a8e-b743-25cc1036c731)

- Enjoy the flexibility of undoing and redoing recent drawing operations.

### 9. Profanity Filter
![image](https://github.com/samjain233/doodle/assets/94921996/cde02f16-cd81-43cd-b6fe-4f1508b8d421)

- Maintain a friendly environment with a profanity filter in the chat.

### 10. Drawing Shapes
![image](https://github.com/samjain233/doodle/assets/94921996/36990f94-bef5-4ad8-a39c-13a3a909e288)

- Explore creativity with the ability to draw various shapes, including circle, square, rectangle, ellipse, free draw, and lines.

## Getting Started

To get started with the Real-Time Drawing and Guessing Web App, follow these steps:

1. Clone the repository.
```bash
  git clone [https://link-to-project](https://github.com/samjain233/doodle)
```


2. Go to the project directory

```bash
  cd doodle
```


3. Install dependencies

```bash
  npm install
```
4. Creating .env file
```node
NEXT_PUBLIC_SERVER=http://localhost:5000 //backend Server
NEXT_PUBLIC_CLIENT=http://localhost:3000 //frontend Server

NEXTAUTH_SECRET=kjefe**********************************888 //random string
NEXTAUTH_URL=http://localhost:3000 //frontend Sever
NEXTAUTH_URL_INTERNAL=http://localhost:3000 //frontend Server

GOOGLE_ID= //google id for goolge auth
GOOGLE_CLIENT_SECRET= //google client secret

DISCORD_CLIENT_ID= //discord id for discord auth
DISCORD_CLIENT_SECRET= //discord id for discord auth

GITHUB_ID= //github id for github auth
GITHUB_SECRET= //github id for github auth
```
6. Start the server in development mode

```bash
  npm run dev
```
7. Go to the backend proeject directory
   
```bash
  cd socketBackend
```

8. Install dependencies

```bash
  npm install
```

9. Creating .env file
```node
MONGO_CONN=mongodb+srv://yourUsername:yourpassword@cluster0.****.mongodb.net/dbName
```

10. Start the socket server
```bash
  node websocket.js
```

## Deployment

- *Socket Server (AWS):* The socket server is deployed on AWS to handle real-time communication.

- *Next.js Server (Vercel):* The Next.js server is deployed on Vercel. The live project is accessible at [https://marsdoodle.vercel.app/](https://marsdoodle.vercel.app/).

## Contributing

We welcome contributions to improve and expand the features of this web app. If you have any ideas or want to report issues, feel free to create a pull request or submit an issue in the repository.

Enjoy the drawing and guessing experience with our Real-Time Drawing and Guessing Web App!
