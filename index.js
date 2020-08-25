const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const postsRoute = require("./routes/posts");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// app.set("port", process.env.PORT || 8080);

dotenv.config();

app.use(express.json());
app.use("/api/user", authRoutes);
app.use("/api/posts", postsRoute);

// Mongoose connection
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  () => {
    console.log("Connected to db");
  }
);

app.listen(8080, () => console.log("Server up and running ..."));
