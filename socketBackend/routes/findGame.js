import express from "express";
import { lobby } from "../global/GlobalVariables.js";

const router = express.Router();
router.use(express.json());

router.get("/findgame", async (req, res) => {
  try {
    let isFound = false;
    await lobby.forEach((value, key) => {
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

export default router;
