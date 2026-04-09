export default async function handler(req, res) {
  try {
    const { claim } = req.body;
    // וודא שאתה מחליף את המילה למטה במפתח ה-API האמיתי שלך
    const API_KEY = "AIzaSyC-80nD7sFa_RXk_CKmCR8vU34w8jb78r8";
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze the claim: "${claim}". Respond ONLY with a JSON object in Hebrew containing: executiveSummary (string), verdict (string), and categories (object with ISRAEL, GLOBAL, INFO as arrays of {name, explanation}).` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    
    // בדיקה אם חזרה תשובה תקינה מגוגל
    if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error("API returned an empty or invalid response");
    }

    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
