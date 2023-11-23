import 'dotenv/config'
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { lobby, lobbyTime, userLobbies } from "./global/GlobalVariables.js";

const app = express();
const server = http.createServer(app);
app.use(cors());

import api from "./routes/api.js";

app.use("/", api);

app.get("/", (req, res) => {
  console.log(lobby);
  console.log(lobbyTime);
  console.log(userLobbies);
  const object = {
    title: "camelCase mars doodle game app",
    server: "on",
    statusCode: 200,
  };
  res.json(object);
});

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = 5000;
server.listen(port, function () {
  console.log("app listening on port : " + port);
});
