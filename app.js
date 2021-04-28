const fs = require("fs");
const express = require("express");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);
const User = require("./models/userModel");
var path = require("path");
const { body, validationResult } = require("express-validator");
const BlogPost = require("./models/blogModel");
app = express();

// MIDDLE WARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/webpages/`));
app.use(cookieParser());
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.render("login");
  }
};

// DB URI
const mongoURI = "mongodb://localhost:27017/artOfFinance";

// FOR STORING CURRENT SESSION
const store = new mongoDBSession({
  uri: mongoURI,
  collection: "mySession",
});

// MIDDLE WARE
app.use(
  session({
    secret: "art of finance",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// TEMPLATING AND SERVER SIDE RENDERING
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// CONTROLLERS
const getPost = async (req, res) => {
  res.render("post", { post: await BlogPost.findById(req.params["id"]) });
};

const createPost = async (req, res) => {
  try {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var today = new Date();

    const blogPost = await BlogPost.create({
      postDate: today.toLocaleDateString("en-US", options),
      authorName: req.body.name,
      blogTitle: req.body.title,
      imageUrl: req.body.imgUrl,
      description: req.body.description,
    });
    console.log(blogPost);
    res.render("blog", { posts: await BlogPost.find() });
  } catch (error) {
    res.status(200).json({
      status: "fail",
      message: error,
    });
  }
};

const overview = (req, res) => {
  res.render("index", { message: [] });
};

const form_request = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("index", { message: errors.array() });
  }
  res.render("index", { message: [{ msg: "Thanks! Request Sent" }] });
};

app.post(
  "/request_call",
  [
    body("name", "Enter a valid name").trim().isLength({ min: 1 }).escape(),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").isMobilePhone(),
  ],
  form_request
);

// ROUTES
app.route("/").get(overview);

app.get("/blog", async (req, res) => {
  const blogs = await BlogPost.find();
  res.render("blog", { posts: blogs });
});

app.get("/post/:id", getPost);

app.get("/create_post", isAuth, (req, res) => {
  if (req.session.isAuth) return res.render("create_post");

  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    req.session.isAuth = true;
    res.render("create_post");
  } else {
    res.render("login");
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.render("register");
  }

  const encryptedPassword = await bcrypt.hash(password, 12);
  user = new User({
    username,
    email,
    password: encryptedPassword,
  });

  await user.save();

  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.render("index", { message: [] });
  });
});

app.post("/add_post", createPost);

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

module.exports = app;
