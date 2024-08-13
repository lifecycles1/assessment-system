const express = require("express");
const router = express.Router();
const { studentSubmitAssessment, getStudentAssessments, getTeacherAssessments, markAssessment } = require("../controllers/assessments");

router.post("/submit-assessment", studentSubmitAssessment);

router.get("/student-assessments", getStudentAssessments);

router.get("/teacher-assessments", getTeacherAssessments);

router.put("/teacher-assessments/mark/:assessmentId", markAssessment);

module.exports = router;
