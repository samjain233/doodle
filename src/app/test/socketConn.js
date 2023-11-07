// import { useEffect } from "react";
import io from "socket.io-client";

const server = "https://trendbyte.tech";

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

export const socket = io(server, connectionOptions);

// const handleClick = () => {
//   socket.emit("userJoined", "hello everyone");
// };

// const userJoined = (data) => {
// //   console.log(data);
//   if (data.success) {
//     console.log("userJoined");
//   } else {
//     console.log("userJoined error");
//   }
// };

// const tutorial = () => {
//   useEffect(() => {
//     socket.on("userIsJoined", userJoined);
//     return () => {};
//   }, []);

//   return (
//     <>
//       <div
//         className="w-[100px] h-[100px] bg-blue-600"
//         onClick={handleClick}
//       ></div>
//     </>
//   );
// };

// export default tutorial;
