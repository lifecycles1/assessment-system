/* eslint-disable react/prop-types */
import { useEffect } from "react";
import TeacherAssessments from "./TeacherAssessments";

const TeacherDashboard = ({ token }) => {
  useEffect(() => {
    console.log("teacher dashboard token", token);
  }, [token]);
  return (
    <div>
      <h1>Welcome, {token?.email.split("@")[0]}</h1>
      <TeacherAssessments />
    </div>
  );
};

export default TeacherDashboard;
