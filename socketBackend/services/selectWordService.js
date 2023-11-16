import { io } from "../websocket.js";

io.on("wordChoosed",(data)=>{
    console.log(data);
})