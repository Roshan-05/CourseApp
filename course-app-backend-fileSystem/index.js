const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require('cors')


const app = express();
app.use(cors())
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
try {
  ADMINS = JSON.parse(fs.readFileSync("admin.json", "utf8"));
  USERS = JSON.parse(fs.readFileSync("users.json", "utf8"));
  COURSES = JSON.parse(fs.readFileSync("courses.json", "utf8"));
} catch {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}
console.log(ADMINS, USERS, COURSES);

const adminSecret = "my_special_secret_key";

const generateAdminJWT = (admin) => {
  const user = { username: admin.username };
  return jwt.sign(user, adminSecret, { expiresIn: "1h" });
};

const adminAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, adminSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
//

const userSecret = "user_special_secret_key_sdckshr";

const generateUserJWT = (userInfo) => {
  const user = { username: userInfo.username };
  return jwt.sign(user, userSecret, { expiresIn: "1h" });
};

const userAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, userSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const isPresent = ADMINS.find((a) => a.username === admin.username);
  if (isPresent) {
    res.status(403).json({message :"Admin already exists!"});
  } else {
    ADMINS.push(admin);
    fs.writeFileSync("admin.json", JSON.stringify(ADMINS));
    const token = generateAdminJWT(admin);
    res.json({ message: "Admin Created Successfully", token: token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (!admin) {
    res.status(403).send("Invalid username or password");
  } else {
    const token = generateAdminJWT(admin);
    res.json({ message: "Logged In Successfully", token });
  }
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  fs.writeFileSync("courses.json", JSON.stringify(COURSES));
  res.json({
    message: "Course created successfully",
    courseId: course.id,
  });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  let course = COURSES.find((c) => c.id === id);
  if (!course) {
    res.status(404).send("Course not found");
  } else {
    // const temp = []
    // fs.writeFileSync('courses.json', JSON.stringify(temp))
    Object.assign(course, req.body);
    console.log("inside the update route");
    console.log(COURSES);
    fs.writeFileSync("courses.json", JSON.stringify(COURSES));
    res.json({ message: "Course Updated Successfully" });
  }
});

app.get("/admin/courses", adminAuthentication,  (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: [],
  };
  const isPresent = USERS.find((a) => a.username === user.username);

  if (isPresent) {
    res.status(403).send("User already exists!");
  } else {
    USERS.push(user);
    fs.writeFileSync("users.json", JSON.stringify(USERS));
    const token = generateUserJWT(user);
    res.json({ message: "User Created Successfully", token: token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = generateUserJWT(user);
    res.json({ message: "Logged In Successfully", tokenID: token });
  } else {
    res.status(403).send("User Not Authorized");
  }
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  const courses = COURSES.filter((c) => c.published);
  res.json({ courses: courses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === id && c.published);
  if (course) {
    const user = USERS.find((u) => u.username === req.user.username);
    if (user) {
      user.purchasedCourses.push(course);
      fs.writeFileSync("users.json", JSON.stringify(USERS));
      res.json({ message: "course purchased successfully" });
    } else {
      res.status(403).json({ message: "user not found" });
    }
  } else {
    res.status(404).json({ message: "course not found" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((u) => u.username === req.user.username);
  console.log(user);
  if (user && user.purchasedCourses) {
    res.json({ purchased_Courses: user.purchasedCourses });
  } else {
    res.json({ message: "Courses not purchased" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
