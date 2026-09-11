import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Online Compiler Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/execute", (req, res) => {
  const { code, language, stdin } = req.body;

  res.json({
    stdout: `Backend received ${language} code:\n${code}`,
    stderr: "",
    exitCode: 0,
    executionTimeMs: 10,
    memoryMb: 12,
    engineUsed: "render-backend"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});