export default async function handler(req, res) {
  try {
    // בורסל req.body כבר מגיע כאובייקט, אסור לעשות לו JSON.parse
    const { claim } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze the claim: "${claim}". Respond ONLY with a JSON object in Hebrew containing: executiveSummary, verdict, and categories.` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();

    // בדיקה שה-API של גוגל החזיר תשובה תקינה
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ error: "Invalid API response", details: data });
    }

    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
