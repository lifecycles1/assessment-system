const express = require("express");
const router = express.Router();
const { studentSubmitAssessment, getStudentAssessments, getTeacherAssessments, markAssessment } = require("../controllers/assessments");
const verifyJWT = require("../middleware/verifyJWT");

router.post("/submit-assessment", verifyJWT, studentSubmitAssessment);

router.get("/student-assessments", verifyJWT, getStudentAssessments);

router.get("/teacher-assessments", verifyJWT, getTeacherAssessments);

router.put("/teacher-assessments/mark/:assessmentId", verifyJWT, markAssessment);

module.exports = router;
