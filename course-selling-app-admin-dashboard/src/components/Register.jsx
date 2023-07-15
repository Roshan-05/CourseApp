import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import axios from "axios";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const navigate = useNavigate();
  const [username, setusername] = React.useState("");
  const [password, setPass] = useState("");

 

  const posting = async () => {
    // a post request will go to the backend
    const res = await axios.post("http://localhost:3000/admin/signup", {
      username: username,
      password: password,
    });

    const data = res.data;
    console.log(data.message)
    localStorage.setItem("token", data.token);
    navigate('/courses')
  };

  return (
    <div className="signup-card">
      <Card className="SignUp" variant="outlined">
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <span>Sign Up</span>
          <div className="form">
            <TextField
              className="input"
              label="email"
              variant="outlined"
              size="small"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <TextField
              className="input"
              label="password"
              variant="outlined"
              size="small"
              value={password}
              type="password"
              onChange={(e) => setPass(e.target.value)}
            />
            <Button className="add-btn" variant="contained" onClick={posting}>
              Sign Up
            </Button>
          </div>
          <div className="alternate">
            Already a user? <NavLink to="/login">Login</NavLink>
          </div>
        </Typography>
      </Card>
    </div>
  );
}

export default Register;
