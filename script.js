const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Check for existing API key
window.onload = () => {
    if (localStorage.getItem("guru_api_key")) {
        document.getElementById("setup-screen").classList.add("hidden");
    }
};

function saveApiKey() {
    const key = document.getElementById("apiKeyInput").value;
    if (key) {
        localStorage.setItem("guru_api_key", key);
        document.getElementById("setup-screen").classList.add("hidden");
    }
}

function clearKey() {
    localStorage.removeItem("guru_api_key");
    location.reload();
}

async function askGuru() {
    const inputField = document.getElementById("userInput");
    const history = document.getElementById("chatHistory");
    const apiKey = localStorage.getItem("guru_api_key");
    const userText = inputField.value;

    if (!userText) return;

    // Show User Message
    history.innerHTML += `<div class="message user-msg">${userText}</div>`;
    inputField.value = "";

    // Teacher Prompt (System Instruction)
    const systemPrompt = "You are a wise and patient Sanskrit Teacher (Guru). " +
        "Break down any shloka into Anvaya (prose order), Padachheda (word splitting), and provide a deep philosophical and grammatical explanation. " +
        "Always be encouraging. Use Devanagari script for Sanskrit words followed by English transliteration and meaning.";

    try {
        const response = await fetch(`${API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nStudent asks: ${userText}` }] }]
            })
        });

        const data = await response.json();
        const guruText = data.candidates[0].content.parts[0].text;

        // Show Guru Response
        history.innerHTML += `<div class="message guru-msg"><strong>Guru says:</strong><br>${guruText.replace(/\n/g, '<br>')}</div>`;
        history.scrollTop = history.scrollHeight;
    } catch (error) {
        history.innerHTML += `<div class="message error">Error: Make sure your API key is correct.</div>`;
    }
}
