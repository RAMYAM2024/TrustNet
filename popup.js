document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsDiv = document.getElementById('results');
    const riskLevel = document.getElementById('riskLevel');
    const riskScore = document.getElementById('riskScore');
    const harmTypes = document.getElementById('harmTypes');
    const problematicPhrases = document.getElementById('problematicPhrases');
    const suggestions = document.getElementById('suggestions');
    const realtimeFeedback = document.getElementById('realtimeFeedback');
    const reportBtn = document.getElementById('reportBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const scanPageBtn = document.getElementById('scanPageBtn');

    scanPageBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        const text = document.body.innerText.toLowerCase();
                        const harmfulKeywords = [
                            "hate", "racism", "sexism", "bigotry", "violence", "abuse",
                            "bullying", "harassment", "discrimination", "kill", "attack",
                            "suicide", "self-harm", "pedo", "nazi", "terrorist"
                        ];
                        const flagged = harmfulKeywords.filter(keyword => text.includes(keyword));
                        if (flagged.length > 0) {
                            alert(`Harmful content detected! Keywords: ${flagged.join(", ")}`);
                            console.log("[TrustNet] Detected keywords:", flagged);
                        } else {
                            alert("No harmful content found.");
                        }
                    }
                });
            } else {
                console.error("[TrustNet] No active tab found.");
            }
        });
    });

    analyzeBtn.addEventListener('click', async function() {
        const text = textInput.value.trim();
        if (!text) {
            realtimeFeedback.textContent = "Please enter text";
            realtimeFeedback.style.color = "#e74c3c";
            return;
        }

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span class="btn-icon">⏳</span> Analyzing...';
        realtimeFeedback.textContent = "Using AI to analyze...";
        realtimeFeedback.style.color = "#3498db";

        try {
            const result = await analyzeContentWithAI(text);
            riskScore.textContent = `${result.score}%`;
            riskLevel.textContent = result.riskLevel.toUpperCase();
            harmTypes.innerHTML = result.harmTypes.map(type => `<li>${type}</li>`).join('');
            problematicPhrases.innerHTML = result.problematicPhrases.map(phrase => `<li>"${phrase}"</li>`).join('');
            suggestions.textContent = result.suggestions;
            resultsDiv.classList.remove('hidden');
            realtimeFeedback.textContent = "Analysis complete";
        } catch (error) {
            realtimeFeedback.textContent = `Error: ${error.message}`;
            realtimeFeedback.style.color = "#e74c3c";
            console.error('Analysis failed:', error);
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span class="btn-icon">🔍</span> Analyze Content';
        }
    });

    async function analyzeContentWithAI(text) {
        const API_KEY = 'AIzaSyDb87WuwpB5uO8W4_S6QCiV1d8G5Fk3pTw';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
        const prompt = {
            contents: [{
                parts: [{
                    text: `Analyze this text for harmful content: "${text}". 
                    Respond ONLY with this JSON format:
                    {
                        "score": 0-100,
                        "riskLevel": "low/medium/high",
                        "harmTypes": [],
                        "problematicPhrases": [],
                        "suggestions": "1. suggestions: ... 2. Alternative phrases: ..."
                    }`
                }]
            }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prompt)
            });
            const data = await response.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 0, riskLevel: "low", harmTypes: [], problematicPhrases: [], suggestions: "Error" };
        } catch (error) {
            console.error("API Error:", error);
            return { score: 0, riskLevel: "low", harmTypes: ["API Error"], problematicPhrases: [], suggestions: "Check console" };
        }
    }

    reportBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text && riskScore.textContent !== "0%") {
            const report = { 
                text, 
                score: riskScore.textContent, 
                harmTypes: Array.from(harmTypes.children).map(li => li.textContent),
                timestamp: new Date().toISOString() 
            };
            console.log("[TrustNet] Reported:", report);
            alert("Reported to console—mitigated!");
        } else {
            alert("No harmful content to report.");
        }
    });

    settingsBtn.addEventListener('click', function() {
        const userKey = prompt("Enter your API key (leave blank to use default):");
        if (userKey) {
            chrome.storage.sync.set({ apiKey: userKey }, () => {
                alert("API key saved!");
            });
        }
    });
});