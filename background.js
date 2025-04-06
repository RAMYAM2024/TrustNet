console.log("[TrustNet] Background script loaded");
chrome.runtime.onInstalled.addListener(() => {
    console.log('TrustNet extension installed');
});

async function analyzeTextWithGemini(text) {
    const API_KEY = 'AIzaSyDb87WuwpB5uO8W4_S6QCiV1d8G5Fk3pTw';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const prompt = {
        contents: [{
            parts: [{
                text: `Analyze for hate speech/bullying: "${text}". Respond ONLY with:
                {
                    "score": 0-100,
                    "riskLevel": "low/medium/high",
                    "harmTypes": [],
                    "problematicPhrases": [],
                    "suggestions": "1. Suggestions: ... 2. Alternative phrases: ..."
                }`
            }]
        }]
    };

    try {
        console.log("[TrustNet] Sending request to Gemini API...");
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prompt)
        });

        if (!response.ok) throw new Error(`API failed with status ${response.status}`);

        const data = await response.json();
        console.log("[TrustNet] API response received:", data);

        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) throw new Error("Invalid or empty response text");

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 0, error: "Invalid response format" };
    } catch (error) {
        console.error("[TrustNet] Gemini API Error:", error);
        return { score: 0, error: error.message };
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[TrustNet] Received message:", request.type, "from:", sender.url || "unknown");
    if (request.type === "scanText") {
        console.log("[TrustNet] Text to analyze:", request.text.substring(0, 50) + "...");
        analyzeTextWithGemini(request.text)
            .then(sendResponse)
            .catch(err => {
                console.error("[TrustNet] Error in analyzeTextWithGemini:", err);
                sendResponse({ score: 0, error: err.message });
            });
        return true; // Required for async response
    }
    
    if (request.type === "quickScan") {
        try {
            const flagged = request.text.match(
                /\b(hate|racism|sexism|bigotry|violence|abuse|bullying|harassment|discrimination|kill|attack|suicide|self-harm|pedo|nazi|terrorist)\b/gi
            ) || [];
            sendResponse({ flagged: [...new Set(flagged.map(w => w.toLowerCase()))] });
        } catch (error) {
            console.error("[TrustNet] Error in quickScan:", error);
            sendResponse({ flagged: [], error: error.message });
        }
    }
});