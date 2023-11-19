import express from "express";

const router = express.Router();

import findGame from "./findGame.js";

router.use("/api", findGame);

export default router;
