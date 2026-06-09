require("dotenv").config({
  path: require("path").join(
    __dirname,
    ".env"
  )
});

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");

const app = express();

const User =
  require("./models/User");

const Message =
  require("./models/Messages");

app.use(cors());
app.use(express.json());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

if (!fs.existsSync("uploads/avatars")) {
  fs.mkdirSync("uploads/avatars");
}

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const SECRET =
  process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        __dirname,
        "uploads",
        "avatars"
      )
    );
  },

  filename: (req, file, cb) => {
    const ext = path.extname(
      file.originalname
    );

    cb(
      null,
      Date.now() + ext
    );
  }
});

const upload = multer({
  storage
});

mongoose.connect(
  process.env.MONGO_URI
);

const getChatId = (a, b) =>
  [a, b].sort().join("_");

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "empty fields"
      });
    }

    const exists = await User.findOne({
      username
    });

    if (exists) {
      return res.status(400).json({
        error: "exists"
      });
    }

    const hash = await bcrypt.hash(
      password,
      10
    );

    await User.create({
      username,
      password: hash
    });

    res.json({
      ok: true
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "server"
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username
    });

    if (!user) {
      return res.status(400).json({
        error: "no user"
      });
    }

    const ok = await bcrypt.compare(
      password,
      user.password
    );

    if (!ok) {
      return res.status(400).json({
        error: "wrong"
      });
    }

    const token = jwt.sign(
      { username },
      SECRET
    );

    res.json({
      token,
      username
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "server"
    });
  }
});

app.post("/profile/bio", async (req, res) => {

  const {
    username,
    bio
  } = req.body;

  await User.updateOne(
    { username },
    { bio }
  );

  res.json({
    ok: true
  });

});

app.get("/users", async (_, res) => {
  const users = await User.find(
    {},
    "username"
  );

  res.json(
    users
      .map(u => u.username)
      .filter(Boolean)
  );
});

app.get("/profile/:username", async (req, res) => {
  try {

    const user = await User.findOne(
      {
        username: req.params.username
      },
      "username avatar bio"
    );

    if (!user) {
      return res.status(404).json({
        error: "not found"
      });
    }

    res.json(user);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "server"
    });
  }
});

app.post("/profile/update", async (req, res) => {
  try {

    const {
      username,
      bio
    } = req.body;

    await User.updateOne(
      { username },
      { bio }
    );

    res.json({
      ok: true
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "server"
    });
  }
});

app.post(
  "/upload-avatar",
  upload.single("avatar"),
  async (req, res) => {

    try {

      const username =
        req.body.username;

      const avatar =
        `/uploads/avatars/${req.file.filename}`;

      await User.updateOne(
        { username },
        { avatar }
      );

      res.json({
        avatar
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "server"
      });

    }

  }
);

app.get("/dialogs/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const messages = await Message.find({
      $or: [
        { from: username },
        { to: username }
      ]
    }).sort({
      createdAt: -1
    });

    const dialogs = [];
    const seen = new Set();

    for (const msg of messages) {

  const otherUser =
    msg.from === username
      ? msg.to
      : msg.from;

  if (seen.has(otherUser)) {
    continue;
  }

  seen.add(otherUser);

  const user = await User.findOne(
    { username: otherUser },
    "avatar bio"
  );

  dialogs.push({
    username: otherUser,
    avatar: user?.avatar || "",
    bio: user?.bio || "",
    lastMessage: msg.text,
    createdAt: msg.createdAt
  });

}

    res.json(dialogs);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "server"
    });
  }
});

io.use((socket, next) => {
  try {

    const token =
      socket.handshake.auth?.token;

    console.log(
      "AUTH TOKEN:",
      token
    );

    const decoded =
      jwt.verify(
        token,
        SECRET
      );

    console.log(
      "AUTH OK:",
      decoded
    );

    socket.user = decoded;

    next();

  } catch (err) {

    console.log(
      "AUTH FAILED:",
      err.message
    );

    next(
      new Error("auth error")
    );
  }
});

const online = new Map();

io.on("connection", (socket) => {
  const username = socket.user.username;

  console.log("CONNECTED:", username);

  online.set(
    username,
    socket.id
  );

  io.emit(
    "onlineUsers",
    [...online.keys()]
  );

  socket.on("joinChat", (chatId) => {
    console.log("JOIN ROOM:", chatId);

    socket.join(chatId);
  });

  socket.on(
    "getChat",
    async ({ user1, user2 }) => {
      try {
        const chatId = getChatId(
          user1,
          user2
        );

        const msgs =
          await Message.find({
            chatId
          }).sort({
            createdAt: 1
          });

        socket.emit(
          "chatHistory",
          {
            chatId,
            msgs
          }
        );

      } catch (err) {
        console.error(err);
      }
    }
  );

  socket.on(
    "sendMessage",
    async (data) => {
      try {

        const chatId =
          getChatId(
            data.from,
            data.to
          );

        const msg =
          await Message.create({
            chatId,
            from: data.from,
            to: data.to,
            text: data.text
          });

        io.to(chatId).emit(
          "newMessage",
          msg
        );

      } catch (err) {
        console.error(err);
      }
    }
  );

  socket.on("disconnect", () => {

    online.delete(username);

    io.emit(
      "onlineUsers",
      [...online.keys()]
    );
  });
});

server.listen(3001, () => {
  console.log(
    "SERVER READY 3001"
  );
});