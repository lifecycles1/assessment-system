import SubmissionList from "./SubmissionList";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";

const TeacherDashboard = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setEmail(decoded.email);
    }
  }, []);

  return (
    <div>
      <h1>Welcome, {email.split("@")[0]}</h1>
      <SubmissionList />
    </div>
  );
};

export default TeacherDashboard;
