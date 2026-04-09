export default async function handler(req, res) {
  try {
    const { claim } = req.body;
    const API_KEY = "AIzaSyC-80nD7sFa_RXk_CKmCR8vU34w8jb78r8";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze the claim: "${claim}". Respond ONLY with a JSON object in Hebrew.` }] }]
      })
    });

    const data = await response.json();

    // בדיקה קריטית למניעת שגיאת "reading 0 of undefined"
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Google API Error:", data);
      return res.status(500).json({ error: "No analysis returned from API", raw: data });
    }

    // ניקוי טקסט במידה וגוגל מחזיר Markdown בתוך התשובה
    let textResult = data.candidates[0].content.parts[0].text;
    textResult = textResult.replace(/```json|```/g, "").trim();

    return res.status(200).json(JSON.parse(textResult));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
