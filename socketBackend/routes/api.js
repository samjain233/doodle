import express from "express";

const router = express.Router();

import findGame from "./findGame.js";
import getScore from "./getScore.js";

router.use("/api", findGame);
router.use("/api", getScore);

export default router;
