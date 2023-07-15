import HomeIcon from "@mui/icons-material/Home";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  return (
    <div className="navbar">
      <HomeIcon sx={{ fontSize: 40 }} />
      {isLoggedIn && 
        <div className="signing">
        <Button className="add-btn" onClick={()=>navigate("/about")}>
         Add Course
        </Button>
        <Button className="add-btn" onClick={()=>navigate("/courses")}>
          Courses
        </Button>
        <Button className="add-btn" variant="contained" onClick={()=>{
          localStorage.setItem("token", null);
          window.location = "/"
        }}>
          Log Out
        </Button>
      </div>
      }
      {isLoggedIn && 
      <div className="signing">
        <Button className="add-btn" variant="contained" onClick={()=>navigate("/login")}>
         Sign In
        </Button>
        <Button className="add-btn" variant="contained" onClick={()=>navigate("/register")}>
          Sign Up
        </Button>
      </div>}
    </div>
  );
};

export default Navbar;
