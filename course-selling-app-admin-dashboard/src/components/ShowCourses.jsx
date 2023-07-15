/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import axios from "axios";
import Avatar from "@mui/material/Avatar";

function ShowCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const func = async () => {
      let allCourses = await axios.get("http://localhost:3000/admin/courses", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      allCourses = allCourses.data.courses;
      console.log(allCourses);
      setCourses(allCourses);
    };
    func();
  }, []);

  return (
    <div className="all-courses">
      {courses.map((course) => {
        return <Container course={course} key={course.id}/>
      })}
    </div>
  );
}

const Container = ({course}) => {
  return (
    <div>
      <Card className="show-card" variant="outlined">
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <Avatar
            className="avatar"
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 164, height: 164 }}
          />
          <div className="details">
            <div className="top-level">
              <h4>{course.title}</h4>
              <p>{course.price}</p>
            </div>
            <p>{course.description}</p>
          </div>
        </Typography>
      </Card>
    </div>
  );
};

export default ShowCourses;
