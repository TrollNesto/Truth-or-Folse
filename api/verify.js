export default async function handler(req, res) {
  try {
    const { claim } = req.body; // בלי JSON.parse!
    const API_KEY = "AIzaSyC-80nD7sFa_RXk_CKmCR8vU34w8jb78r8";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `בצע ניתוח לטענה: "${claim}". תחזיר אובייקט JSON בעברית עם executiveSummary ו-verdict.` }] }]
      })
    });

    const data = await response.json();
    
    if (!data.candidates) {
      return res.status(500).json({ error: "שגיאה ב-API של גוגל", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
