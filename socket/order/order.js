
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
console.log("here");

const initializeSocket = (server) => {
  const io = new Server(server, {
      cors: {
          origin: process.env.CLIENT_URL, // Allow frontend connection
          methods: ["GET", "POST"]
      }
  });
  

  // Handling socket connections
  io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Join an order room based on the order ID
      socket.on("joinOrder", (payload) => {

        const orderId= payload.orderId
        const user=payload.user
          socket.join(orderId); // Join a room with the order ID
      });
      socket.on("updateLocation", (payload) => {
        const { orderId, user, coords } = payload;
        console.log(user);
        
        console.log(`Payload ${orderId} ,${coords} `);
        
        io.to(orderId).emit("driverLocationUpdated", { coords,orderId });
    });
    socket.on("sendRoute", (payload) => {
      const { route,orderId } = payload; 
      
      io.to(orderId).emit("driverSentRoute", { route,orderId });
  });
       socket.on("updateOrderState", (payload) => {   
        const { taskId, state} = payload;       
        io.to(taskId).emit("orderUpdated", { taskId, state });
      });

   

      socket.on("disconnect", () => {
          console.log("Client disconnected:", socket.id);
      });
  });
};

export default initializeSocket;