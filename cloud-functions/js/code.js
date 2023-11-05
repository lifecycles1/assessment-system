const vm = require("node:vm");

exports.jsCode = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header("access-control-request-headers"));
  if (req.method === "OPTIONS") {
    res.status(204).send("");
  } else {
    try {
      const { code, question } = req.body;

      const results = [];
      for (const input of question.inputsOutputs) {
        const sandbox = {
          results: null,
          log: [],
          console: {
            log: (...args) => {
              let formattedArgs = args.map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)));
              sandbox.log.push(formattedArgs.join(" "));
            },
          },
        };
        vm.createContext(sandbox);
        const script = `results = (function() {
          ${code}
          return solution(${JSON.stringify(input.inputs)});
        })()`;
        vm.runInContext(script, sandbox);
        results.push({ results: sandbox.results, log: sandbox.log });
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
        outputs: results.map((result) => result.results),
        logs: results.map((result) => result.log),
        expectedOutputs: question.inputsOutputs.map((input) => input.output),
        isCorrect: results.map((result, i) => deepEqual(result.results, question.inputsOutputs[i].output)),
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
