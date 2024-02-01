const { EditorAssessment, FileAssessment } = require("../models/assessment");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: process.env.GCLOUD_STORAGE_KEY });
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
const formidable = require("formidable");
const fs = require("fs");

// Controller for handling assessment submissions
const studentSubmitAssessment = async (req, res) => {
  try {
    let AssessmentModel;
    let assessmentData = {};
    if (req.get("content-type") === "application/json") {
      AssessmentModel = EditorAssessment;
      const { email, language, code, question } = req.body;
      console.log("student submit assessment", req.body);
      assessmentData = { email, language, question, code };
    } else if (req.get("content-type").startsWith("multipart/form-data")) {
      AssessmentModel = FileAssessment;
      const form = new formidable.IncomingForm();
      const [fields, files] = await form.parse(req);
      assessmentData = {
        email: String(fields.email[0]),
        language: String(fields.language[0]),
        question: JSON.parse(String(fields.question[0])),
      };
      const { file } = files;
      // Create a promise to handle the file upload
      const uploadFilePromise = new Promise((resolve, reject) => {
        const cloudFileName = `${Date.now()}-${file[0].originalFilename}`;
        const fileUploadStream = bucket.file(cloudFileName).createWriteStream();
        fileUploadStream.on("error", (err) => {
          console.log(err);
          reject(err);
        });
        fileUploadStream.on("finish", () => {
          // Set the fileUrl field in the mongo model to the GCS URL
          assessmentData.fileUrl = `https://storage.googleapis.com/${bucket.name}/${cloudFileName}`;
          resolve();
        });
        // Open a readable stream from the file
        const fileReadStream = fs.createReadStream(file[0].filepath);
        // Pipe the file read stream to Google Cloud Storage write stream
        fileReadStream.pipe(fileUploadStream);
      });
      await uploadFilePromise;
    }
    // Create a new assessment document
    const assessment = new AssessmentModel(assessmentData);
    // Save the assessment to the database
    await assessment.save();
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error submitting assessment" });
  }
};

const getStudentAssessments = async (req, res) => {
  try {
    const { email } = req.params;
    const editorAssessments = await EditorAssessment.find({ email }).sort({ createdAt: -1 });
    const fileAssessments = await FileAssessment.find({ email }).sort({ createdAt: -1 });
    const studentAssessments = [...editorAssessments, ...fileAssessments];
    return res.status(200).json(studentAssessments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving assessments" });
  }
};

const getTeacherAssessments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const editorAssessments = await EditorAssessment.find({ status: "pending" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const fileAssessments = await FileAssessment.find({ status: "pending" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const teacherAssessments = [...editorAssessments, ...fileAssessments];
    return res.status(200).json(teacherAssessments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving teacher assessments" });
  }
};

// Update a student's assessment status, grade, and feedback
const markAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { type, status, grade, feedback } = req.body;

    // Determine the model based on the type
    let AssessmentModel;
    if (type === "file") {
      AssessmentModel = FileAssessment;
    } else if (type === "code") {
      AssessmentModel = EditorAssessment;
    }

    // Find the assessment by ID and update its fields
    await AssessmentModel.findOneAndUpdate({ _id: assessmentId }, { status, "evaluation.grade": grade, "evaluation.feedback": feedback });

    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};

module.exports = { studentSubmitAssessment, getStudentAssessments, getTeacherAssessments, markAssessment };
