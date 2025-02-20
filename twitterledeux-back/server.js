require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const cors = require('cors');
const http = require("http");
const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Création du serveur HTTP lié à Express
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // À restreindre en production
    methods: ["GET", "POST"]
  }
});

// Routes
const followersRoute = require('./routes/followers');
const postsRoute = require('./routes/posts');
const retweetsRoute = require('./routes/retweets');
const likesRoute = require('./routes/likes');
const messagesRoute = require('./routes/messages');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const uploadRoute = require('./routes/upload');

app.use('/followers', followersRoute);
app.use('/posts', postsRoute);
app.use('/retweets', retweetsRoute);
app.use('/likes', likesRoute);
app.use('/messages', messagesRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/upload', uploadRoute);
app.use("/uploads", express.static("uploads"));

const createRoomId = (userId1, userId2) => {
  const ids = [userId1, userId2].sort();
  return `${ids[0]}-${ids[1]}`;
};

io.on("connection", (socket) => {
    console.log("🟢 Un utilisateur est connecté :", socket.id);

    socket.on("joinRoom", (room) => {
        console.log(`Utilisateur ${socket.id} rejoint la salle : ${room}`);
        socket.join(room);
    });

    socket.on("sendMessage", (message) => {
        const roomId = createRoomId(message.senderId, message.receiverId);
        console.log("📩 Message reçu :", message);
        console.log(`Émission du message à la salle : ${roomId}`);
        io.to(roomId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Un utilisateur s'est déconnecté :", socket.id);
    });
});

server.listen(port, () => {
    console.log(`🚀 Serveur WebSocket + API démarré sur le port ${port}`);
});
