import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((err) => {
    console.log(err);
  });
