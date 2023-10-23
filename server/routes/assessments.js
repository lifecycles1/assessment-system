const express = require("express");
const router = express.Router();
const { submitCode, getStudentAssessments, getTeacherAssessments } = require("../controllers/assessments");

router.post("/submit-code", submitCode);

router.get("/student-assessments/:email", getStudentAssessments);

router.get("/teacher-assessments", getTeacherAssessments);

module.exports = router;
