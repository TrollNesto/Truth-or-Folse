export default async function handler(req, res) {
  try {
    const { claim } = JSON.parse(req.body);
    const API_KEY = "AIzaSyC-80nD7sFa_RXk_CKmCR8vU34w8jb78r8";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze: "${claim}". Respond ONLY with a raw JSON object (no markdown, no backticks) in Hebrew: {"executiveSummary": "...", "verdict": "...", "categories": {"ISRAEL": [], "GLOBAL": [], "INFO": []}}` }] }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
