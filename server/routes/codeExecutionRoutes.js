import express from "express";

import { Sandbox } from "@e2b/code-interpreter";

const router = express.Router();

//code execution on output console
router.post("/execute", async (req, res) => {
  let sandbox;

  try {
    const { sourceCode, language } = req.body;

    // console.log("SOURCE CODE:");
    // console.log(sourceCode);

    // console.log("LANGUAGE:");
    // console.log(language);

    sandbox = await Sandbox.create({
      apiKey: process.env.E2B_API_KEY,
    });

    // console.log("LANGUAGE:", language);
    const execution = await sandbox.runCode(sourceCode, {
      language,
    });

    console.log("EXECUTION RESULT:", JSON.stringify(execution, null, 2));

    const stdout = execution.logs?.stdout?.join("") || "";

    const stderr = execution.logs?.stderr?.join("") || "";

    const runtimeError = execution.error
      ? `${execution.error.name}: ${execution.error.value}`
      : "";

    const output = runtimeError || stderr || stdout || "No output";

    res.status(200).json({
      output,
    });
  } catch (err) {
    console.log("EXECUTION ERROR:", err);

    let output = "Execution failed";

    if (err.name === "TimeoutError") {
      output =
        "Execution timed out. Your code exceeded the maximum execution time.";
    }

    res.status(500).json({
      output,
    });
  } finally {
    try {
      if (sandbox) {
        await sandbox.kill();
      }
    } catch (killError) {
      console.log("SANDBOX CLEANUP ERROR:", killError);
    }
  }
});

export default router;
