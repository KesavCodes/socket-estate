const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = {};
console.log("Online users", onlineUsers);
const addUsers = (userId, socketId) => {
  if (!Object.hasOwn(onlineUsers, userId)) {
    onlineUsers[userId] = socketId;
    console.log("New User Connected:", userId);
  }
};

const removeUsers = (socketId) => {
  Object.keys(onlineUsers).forEach((userId) => {
    if (onlineUsers[userId] === socketId) delete onlineUsers[userId];
  });
};

const getUser = (userId) => onlineUsers[userId];

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUsers(userId, socket.id);
  });
  socket.on("sendMessage", ({ receiverId, data }) => {
    if (getUser(receiverId)) {
      io.to(onlineUsers[receiverId]).emit("getMessage", data);
    }
  });
  socket.on("disconnect", () => {
    removeUsers(socket.id);
    console.log("User Disconnected:", socket.id);
  });
});

io.listen(4000);
