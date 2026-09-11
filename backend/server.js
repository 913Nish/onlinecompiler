import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute";
const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET;

const languageMap = {
  c: { language: "c", versionIndex: "5" },
  cpp: { language: "cpp17", versionIndex: "1" },
  cplusplus: { language: "cpp17", versionIndex: "1" },
  python: { language: "python3", versionIndex: "5" },
  py: { language: "python3", versionIndex: "5" },
  javascript: { language: "nodejs", versionIndex: "5" },
  js: { language: "nodejs", versionIndex: "5" },
  java: { language: "java", versionIndex: "5" },
};

app.get("/", (req, res) => {
  res.send("Online Compiler Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, engine: "jdoodle" });
});

app.post("/api/execute", async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!JDOODLE_CLIENT_ID || !JDOODLE_CLIENT_SECRET) {
      return res.status(500).json({
        stdout: "",
        stderr: "JDoodle credentials are missing in Render environment variables",
        exitCode: 1,
        executionTimeMs: 0,
        memoryMb: 0,
        engineUsed: "jdoodle",
      });
    }

    if (!code || !language) {
      return res.status(400).json({
        stdout: "",
        stderr: "Missing code or language",
        exitCode: 1,
        executionTimeMs: 0,
        memoryMb: 0,
        engineUsed: "jdoodle",
      });
    }

    const jdoodleLanguage = languageMap[language];

    if (!jdoodleLanguage) {
      return res.status(400).json({
        stdout: "",
        stderr: `Language not supported: ${language}`,
        exitCode: 1,
        executionTimeMs: 0,
        memoryMb: 0,
        engineUsed: "jdoodle",
      });
    }

    const start = Date.now();

    const response = await fetch(JDOODLE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
        script: code,
        stdin: stdin || "",
        language: jdoodleLanguage.language,
        versionIndex: jdoodleLanguage.versionIndex,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      return res.status(response.status || 500).json({
        stdout: "",
        stderr: result.error || result.message || "JDoodle request failed",
        exitCode: 1,
        executionTimeMs: Date.now() - start,
        memoryMb: 0,
        engineUsed: "jdoodle",
      });
    }

    res.json({
      stdout: result.output || "",
      stderr: "",
      exitCode: Number(result.statusCode || 200) === 200 ? 0 : 1,
      executionTimeMs: result.cpuTime ? Number(result.cpuTime) * 1000 : Date.now() - start,
      memoryMb: result.memory ? Number(result.memory) / 1024 : 0,
      engineUsed: "jdoodle",
    });
  } catch (error) {
    res.status(500).json({
      stdout: "",
      stderr: error.message || "Server error",
      exitCode: 1,
      executionTimeMs: 0,
      memoryMb: 0,
      engineUsed: "jdoodle",
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