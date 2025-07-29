const express = require("express");
const app = express();
const connectDB = require("./config/database");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
// TODO: import routes
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");

// Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config (autenticate user)
require("./config/passport")(passport);

// Connect To Database
connectDB();

// Using EJS for views
app.set("view engine", "ejs");

// Static Folder
app.use(express.static("public"));

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging requests to console
app.use(logger("dev"));

// Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware (activates Passport for your app)
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages for errors, info, ect...
app.use(flash());

// Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);

// Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
