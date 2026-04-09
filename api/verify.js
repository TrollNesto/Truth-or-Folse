export default async function handler(req, res) {
  try {
    const { claim } = req.body;
    const API_KEY = "AIzaSyC-80nD7sFa_RXk_CKmCR8vU34w8jb78r8";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze the claim: "${claim}". Respond in Hebrew.` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              executiveSummary: { type: "string" },
              verdict: { type: "string" },
              categories: {
                type: "object",
                properties: {
                  ISRAEL: { type: "array", items: { type: "object", properties: { name: { type: "string" }, explanation: { type: "string" } } } },
                  GLOBAL: { type: "array", items: { type: "object", properties: { name: { type: "string" }, explanation: { type: "string" } } } },
                  INFO: { type: "array", items: { type: "object", properties: { name: { type: "string" }, explanation: { type: "string" } } } }
                }
              }
            }
          }
        }
      })
    });
    const data = await response.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
