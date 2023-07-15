import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import "../App.css";
import axios from "axios"


function Login() {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPass] = useState("");

  const posting = async () => {
    // a post request will go to the backend
    const res = await axios.post("http://localhost:3000/admin/login",{hello: "world"},{
    headers:{
      username: username,
      password: password,
    }  
    
    });

    const data = res.data;
    console.log(data)
    localStorage.setItem("token", data.token);
    navigate('/courses')

  };

  return (
    <Card className="SignUp" variant="outlined">
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        <span>Sign In</span>
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
            type="password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
          />
          <Button className="add-btn" variant="contained" onClick={posting}>
            Sign In
          </Button>
        </div>
        <div className="alternate">
          Not Registered? <NavLink to="/register">SignUp</NavLink>
        </div>
      </Typography>
    </Card>
  );
}

export default Login;
