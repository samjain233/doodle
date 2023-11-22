import express from "express";
import { lobby } from "../global/GlobalVariables.js";

const router = express.Router();
router.use(express.json());

router.get("/findgame", async (req, res) => {
  try {
    let isFound = false;
    await lobby.forEach((value, key) => {
      // console.log(value, key);
      const isStarted = value.game.isStarted;
      const isFull =
        value.users.length === value.settings.players ? true : false;
      const isPublic = value.settings.visibility === "Public" ? true : false;
      if (isStarted === false && isFull === false && isPublic === true) {
        const data = {
          room: key,
          msg: "sucessfull find a free room",
        };
        isFound = true;
        res.json(data);
      }
    });
    if (isFound === false) {
      const data = {
        room: null,
        msg: "no free rooms found",
      };
      res.json(data);
    }
  } catch (err) {
    console.log(err);
    const data = {
      room: null,
      msg: "no free rooms found",
    };
    res.json(data);
  }
});

router.get("/findgame/:room_id", (req, res) => {
  try {
    const roomId = req.params.room_id;
    const lobbyData = lobby.get(roomId);
    //room doesn't exists
    if (lobbyData === undefined) {
      const data = {
        room: null,
        msg: "room doesn't exists",
      };
      res.json(data);
    } else {
      // room exists , checking for empty and not started of game
      const isStarted = lobbyData.game.isStarted;
      const isFull =
        lobbyData.users.length === lobbyData.settings.players ? true : false;

      if (isStarted === false && isFull === false) {
        const data = {
          room: roomId,
          msg: "room found",
        };
        res.json(data);
      } else {
        const data = {
          room: null,
          msg: "unable to join room : " + roomId,
        };
        res.json(data);
      }
    }
  } catch (err) {
    console.log(err);
    const data = {
      room: null,
      msg: "unable to join server",
    };
    res.json(data);
  }
});

export default router;
