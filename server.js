const express = require("express");
const session = require("express-session");
const app = express();
const PORT = 5001;
require("dotenv").config();
const methodOverride = require("method-override");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
//authenticate Token
const { authenticateToken } = require("./auth/authUser");
// Routes
const indexRouter = require("./routes/indexRouter");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const apiRoutes = require("./routes/apiRoutes");
const mongoose = require("mongoose");

// connection routes are in db folder
//  config connection: open connection
const DB_NAME = process.env.DB_NAME;
const DB_LINK = process.env.DB_LINK;
const mongoURI = DB_LINK + DB_NAME;

// middleware settings
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/Public"));

// DAta Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    maxage: 60000,
  })
);

// database configuration is in db folder
// GRids Configuration is in the db folder

// Routes
app.use("/", indexRouter);
app.use("/user", userRoutes);
app.use("/admin", authenticateToken, adminRoutes);
// app.use("/admin",  adminRoutes);
app.use("/api", apiRoutes);
app.get("*", (req, res) => {
  res.status(404).send("you may not be authorised to view this page");
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
