import express from "express";
import User from "../models/User.js";

const router = express.Router();
router.use(express.json());

router.get("/getscore/:userid", async (req, res) => {
  try {
    const userId = req.params.userid;
    const userData = await User.findOne({ userEmail: userId });
    if (userData === null) {
      const data = {
        userEmail: userId,
        score: 0,
      };
      res.json(data);
    } else {
      res.json(userData);
    }
  } catch (err) {
    console.log(err);
    const data = {
      msg: "error occurred",
    };
    res.json(data);
  }
});

export default router;
