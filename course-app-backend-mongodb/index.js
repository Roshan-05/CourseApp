const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Schemas
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  },
});
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
  id: Number,
});
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});
const url =
  "mongodb+srv://Dosa:test1234@cluster0.yxjojrh.mongodb.net/Node?retryWrites=true&w=majority";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000, () => {
      console.log("App is listening for request on 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

// AUTHENTICATION
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
  Admin.find({ username: admin.username })
    .then((result) => {
      // res.status(403).send("Admin is already exists")
      if (result.length === 0) {
        const info = new Admin(admin);
        info.save();
        const token = generateAdminJWT(admin);
        res.json({ message: "Admin Created Successfully", tokenID: token });
      } else {
        res.status(403).json({message : "Admin already exists"});
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  Admin.find({ username: username, password: password })
    .then((result) => {
      if (result.length === 0) {
        res.status(403).send("Invalid Username or Password");
      } else {
        const token = generateAdminJWT(result);
        res.json({ message: "Logged In Successfully", tokenID: token });
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.post("/admin/courses", adminAuthentication, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  course.save();
  res.json({
    message: "Course Created Successfully",
    courseId: course._id,
  });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const id = req.params.courseId;
  Course.findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      if (result.length === 0) {
        res.status(404).send("Course not found");
      } else {
        res.json({
          message: "course updated successfully",
          course: result,
        });
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  Course.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      throw err;
    });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user

  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.status(403).send("User already exists");
      } else {
        const info = new User({ username, password });
        info.save();
        const token = generateUserJWT({ username, password });
        res.json({ message: "user created successfully", tokenID: token });
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  User.findOne({ username, password })
    .then((user) => {
      if (user) {
        const token = generateUserJWT(user);
        res.json({ message: "Logged In Successfully", tokenID: token });
      } else {
        res.status(403).send("User Not Authorized");
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  Course.find({ published: true }).then((courses) => {
    res.json({ courses });
  });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const id = req.params.courseId
  Course.findById(id)
    .then((course) => {
      console.log("user put route meh se hi " + course)
      if (course) {
        User.findOne({ username: req.user.username })
          .then((user) => {
            if (user) {
              user.purchasedCourses.push(course);
              user.save();
              console.log("after buying course"+user.purchasedCourses)
              res.json({ message: "course purchased successfully" });
            } else {
              res.status(403).json({ message: "User Not Found" });
            }
          })
          .catch((err) => {
            throw err;
          });
      } else {
        res.status(403).json({ message: "course not found" });
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/users/purchasedCourses",userAuthentication, (req, res) => {
  // logic to view purchased courses
  User.findOne({username : req.user.username}).populate('purchasedCourses').then(user=>{
    if(user){
      res.json({purchasedCourses : user.purchasedCourses || []})
    }else{
      res.status(403).json({ message: 'User not found' });
    }
  }).catch(err=>{throw err})

});
