import { io } from "../server.js";

io.on("wordChoosed",(data)=>{
    console.log(data);
})