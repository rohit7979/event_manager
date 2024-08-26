const socketIO = require("socket.io");

const initSocket = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });
  });

  return io;
};

module.exports = initSocket;
