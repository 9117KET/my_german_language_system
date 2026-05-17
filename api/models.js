// Diagnostic endpoint - visit /api/models on your Vercel URL to see available Gemini models
module.exports = async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  );
  const data = await response.json();

  // Extract just the names and supported methods for readability
  if (data.models) {
    const summary = data.models
      .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));
    return res.json({ available_for_generateContent: summary, total: summary.length });
  }
  return res.json(data);
};
