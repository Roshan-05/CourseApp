// create course is working fine but after logging out when a new courses is created, courses are not getting created which is fine(that is the normal behaviour) but it should have a way of telling the user that the request they made is invalid that is if the auth token is null or undefined then alert the user 

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import Card from "@mui/material/Card";
import axios from "axios";


function CreateCourse() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState();
  const [imgLink, setImgLink] = useState("");



  const create = async () => {
    const res = await axios.post("http://localhost:3000/admin/courses", {
        title: title,
        description : desc,
        price: price,
        imageLink : imgLink,
        published : true
    },{
        headers: {
            authorization: "Bearer "+ localStorage.getItem("token") 
         }
    });

    const data = res.data;
    console.log(data.message);
  };

  return (
    <div className="signup-card">
      <Card className="create-card" variant="outlined">
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <span>Create Course</span>
          <div className="form">
            <TextField
              className="input"
              label="title"
              variant="outlined"
              size="small"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              className="input"
              label="description"
              variant="outlined"
              size="small"
              value={desc}
              type="text"
              onChange={(e) => setDesc(e.target.value)}
            />
            <TextField
              className="input"
              label="price"
              variant="outlined"
              size="small"
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              className="input"
              label="image link"
              variant="outlined"
              size="small"
              value={imgLink}
              type="text"
              onChange={(e) => setImgLink(e.target.value)}
            />

            <Button
              className="add-btn"
              variant="contained"
              onClick={() => {
                create();
              }}
            >
              Create
            </Button>
          </div>
        </Typography>
      </Card>
    </div>
  );
}
export default CreateCourse;
