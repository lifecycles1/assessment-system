const { Storage } = require("@google-cloud/storage");
const vm = require("node:vm");
const storage = new Storage();

exports.jsFile = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.status(204).send("");
  } else {
    try {
      const { fileUrl, question } = req.body;

      const urlParts = fileUrl.match(/\/\/storage.googleapis.com\/(.*?)\/(.*)/);
      if (!urlParts || urlParts.length !== 3) {
        res.status(400).send("Invalid file URL");
        return;
      }
      const bucketName = urlParts[1];
      const fileName = urlParts[2];

      const [file] = await storage.bucket(bucketName).file(fileName).download();
      const code = file.toString("utf8");

      const results = [];
      for (const input of question.inputsOutputs) {
        const sandbox = { results: null };
        vm.createContext(sandbox);
        const script = `(function() {
          ${code}
          results = solution(${JSON.stringify(input.inputs)});
        })()`;
        vm.runInContext(script, sandbox);
        results.push(sandbox.results);
      }

      const deepEqual = (a, b) => {
        if (a === b) return true;
        if (typeof a !== typeof b) return false;
        if (typeof a !== "object" || a === null || b === null) return a === b;
        if (Array.isArray(a)) {
          if (!Array.isArray(b) || a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
          }
          return true;
        }
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const key of keysA) {
          if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
        }
        return true;
      };

      const assessmentResult = {
        inputs: question.inputsOutputs.map((input) => input.inputs),
        outputs: results,
        expectedOutputs: question.inputsOutputs.map((input) => input.output),
        isCorrect: results.map((result, i) => deepEqual(result, question.inputsOutputs[i].output)),
      };

      res.status(200).json(assessmentResult);
    } catch (error) {
      console.error(error);
      if (error.message) {
        res.status(200).json({ error: error.message }); // Send error message to client
      } else {
        res.status(500).json({ error: "Error executing code." }); // Fallback error message
      }
    }
  }
};
