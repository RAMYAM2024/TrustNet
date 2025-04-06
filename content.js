// content.js - Optimized version for all pages
(() => {
    let isInitialized = false;

    // Function to initialize the content script
    function init() {
        if (isInitialized) return;
        isInitialized = true;

        console.log("[TrustNet] Content script injected into:", window.location.href);

        // List of harmful keywords to detect
        const harmfulKeywords = [
            "hate", "racism", "sexism", "bigotry", "violence", "abuse", 
            "bullying", "harassment", "discrimination", "kill", "attack",
            "suicide", "self-harm", "pedo", "nazi", "terrorist",
        ];

        // Function to show the standard popup
        function showTrustNetPopup(flaggedContent, targetElement = null) {
            const existingPopup = document.getElementById('trustnet-popup');
            if (existingPopup) existingPopup.remove();

            const popup = document.createElement("div");
            popup.id = "trustnet-popup";
            popup.style.cssText = `
                position: absolute;
                background: linear-gradient(135deg, #fff3f3, #ffe6e6);
                border: 2px solid #ff4444;
                border-radius: 8px;
                padding: 16px;
                z-index: 999999;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                font-family: 'Segoe UI', Arial, sans-serif;
                transition: transform 0.3s ease, opacity 0.3s ease;
                transform: scale(1);
                opacity: 1;
            `;

            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
            } else {
                // Default position if no targetElement is provided
                popup.style.top = '20px';
                popup.style.left = '20px';
            }

            popup.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="color: #ff4444; font-size: 20px; font-weight: bold;">⚠</span>
                    <h3 style="margin: 0; font-size: 16px; color: #d32f2f; font-family: 'Segoe UI', Arial, sans-serif;">
                        Potential Harm Detected. Analyze with TrustNet before usage.
                    </h3>
                </div>
                <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">
                    Flagged words: <strong style="color: #d32f2f;">${flaggedContent.join(', ')}</strong>
                </p>
                <button id="trustnet-close-btn"
                    style="
                        position: absolute; top: 5px; right: 5px; 
                        background: #ff4444; border: none; color: white; 
                        font-size: 14px; font-weight: bold; cursor: pointer; 
                        padding: 4px 8px; border-radius: 4px; transition: background 0.3s;
                    ">
                    ×
                </button>
                <div style="margin-top: 10px; text-align: right;">
                    <button id="trustnet-learn-more"
                        style="
                            background: #3498db; border: none; color: white; 
                            font-size: 12px; font-weight: bold; cursor: pointer; 
                            padding: 6px 12px; border-radius: 4px; transition: background 0.3s;
                        ">
                        Learn More
                    </button>
                </div>
            `;

            document.body.appendChild(popup);

            // Add event listeners after appending to DOM
            const closeBtn = popup.querySelector('#trustnet-close-btn');
            const learnMoreBtn = popup.querySelector('#trustnet-learn-more');
            
            if (closeBtn) {
                closeBtn.addEventListener('mouseover', () => closeBtn.style.background = '#d32f2f');
                closeBtn.addEventListener('mouseout', () => closeBtn.style.background = '#ff4444');
                closeBtn.addEventListener('click', () => popup.remove());
            }

            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('mouseover', () => learnMoreBtn.style.background = '#2980b9');
                learnMoreBtn.addEventListener('mouseout', () => learnMoreBtn.style.background = '#3498db');
                learnMoreBtn.addEventListener('click', () => alert('Learn more about flagged content.'));
            }
        }

        // Function to scan text for harmful keywords
        function scanText(text) {
            const lowerText = text.toLowerCase();
            return harmfulKeywords.filter(keyword => 
                new RegExp(`\\b${keyword}\\b`, 'i').test(text)
            );
        }

        // Direct event listener attachment
        function attachInputListeners() {
            const handleInput = (event) => {
                try {
                    const target = event.target;
                    const isTextInput = (
                        target.tagName === "TEXTAREA" ||
                        target.tagName === "INPUT" ||
                        target.isContentEditable ||
                        target.contentEditable === "true" ||
                        target.role === "textbox" ||
                        target.role === "textinput" ||
                        target.classList.contains("public-DraftEditor-content") ||
                        target.getAttribute("aria-multiline") === "true" ||
                        target.matches("[contenteditable]") ||
                        target.id === "contenteditable-root" ||
                        target.classList.contains("yt-formatted-string") ||
                        target.closest(".ytd-commentbox") !== null ||
                        // YouTube search bar specific selector
                        target.id === "search"
                    );

                    if (isTextInput) {
                        const text = target.value || target.textContent || target.innerText;
                        if (text) {
                            const flaggedContent = scanText(text);
                            if (flaggedContent.length > 0) {
                                showTrustNetPopup(flaggedContent, target);
                            }
                        }
                    }
                } catch (err) {
                    console.error("[TrustNet] Input handler error:", err);
                }
            };

            // Attach listeners to all input elements
            const inputSelectors = [
                'input',
                'textarea',
                '[contenteditable]',
                '#search', // YouTube search bar
                '.ytd-commentbox', // YouTube comment box
                '#contenteditable-root' // YouTube comment input
            ];

            inputSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(input => {
                    ["input", "keyup", "paste", "change", "focus"].forEach(eventType => {
                        input.addEventListener(eventType, handleInput, { capture: true, passive: true });
                    });
                });
            });
        }

        attachInputListeners();
    }

    // Handle runtime errors
    chrome.runtime.onConnect.addListener(() => {
        if (!isInitialized) {
            console.log("[TrustNet] Re-initializing content script after context invalidation");
            init();
        }
    });

    // Start the content script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();