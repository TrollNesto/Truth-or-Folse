export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });
  
  try {
    const { claim } = JSON.parse(req.body);
    // הזרקה ישירה של המפתח כדי לבטל תלות ב-Vercel Settings
    const API_KEY = "AIzaSyC-80nD7sFa_RXk_CKmCR8vU34w8jb78r8"; 

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze the claim: "${claim}". Return a JSON object with: executiveSummary (string), verdict (string: אמת/שקר/חלקי), categories (object with lists ISRAEL, GLOBAL, INFO).` }] }],
        generationConfig: { 
          responseMimeType: "application/json" // זה מכריח את גוגל לשלוח קוד נקי בלבד
        }
      })
    });

    const data = await response.json();
    
    if (!data.candidates) {
      return res.status(500).json({ error: "API Key invalid or Quota exceeded" });
    }

    const output = JSON.parse(data.candidates[0].content.parts[0].text);
    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json({ error: "Server Error: " + error.message });
  }
}
