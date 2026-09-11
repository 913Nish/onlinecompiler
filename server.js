import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

const languageIds = {
  c: 50,
  cpp: 54,
  cplusplus: 54,
  python: 71,
  py: 71,
  javascript: 63,
  js: 63,
  java: 62,
};

app.get("/", (req, res) => {
  res.send("Online Compiler Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/execute", async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!JUDGE0_API_KEY) {
      return res.status(500).json({
        stdout: "",
        stderr: "JUDGE0_API_KEY is missing in Render environment variables",
        exitCode: 1,
        executionTimeMs: 0,
        memoryMb: 0,
        engineUsed: "judge0",
      });
    }

    if (!code || !language) {
      return res.status(400).json({
        stdout: "",
        stderr: "Missing code or language",
        exitCode: 1,
        executionTimeMs: 0,
        memoryMb: 0,
        engineUsed: "judge0",
      });
    }

    const languageId = languageIds[language];

    if (!languageId) {
      return res.status(400).json({
        stdout: "",
        stderr: `Language not supported: ${language}`,
        exitCode: 1,
        executionTimeMs: 0,
        memoryMb: 0,
        engineUsed: "judge0",
      });
    }

    const submitResponse = await fetch(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: stdin || "",
        }),
      }
    );

    const result = await submitResponse.json();

    if (!submitResponse.ok) {
      return res.status(submitResponse.status).json({
        stdout: "",
        stderr: result.message || "Judge0 request failed",
        exitCode: 1,
        executionTimeMs: 0,
        memoryMb: 0,
        engineUsed: "judge0",
      });
    }

    res.json({
      stdout: result.stdout || "",
      stderr:
        result.stderr ||
        result.compile_output ||
        result.message ||
        "",
      exitCode: result.status?.id === 3 ? 0 : 1,
      executionTimeMs: Number(result.time || 0) * 1000,
      memoryMb: result.memory ? result.memory / 1024 : 0,
      engineUsed: "judge0",
    });
  } catch (error) {
    res.status(500).json({
      stdout: "",
      stderr: error.message || "Server error",
      exitCode: 1,
      executionTimeMs: 0,
      memoryMb: 0,
      engineUsed: "judge0",
    });
  }
});

app.post("/api/ai-assist", (req, res) => {
  res.json({
    title: "AI Assist Not Configured",
    summary: "Code execution is working, but AI assist is not connected yet.",
    suggestions: [],
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});