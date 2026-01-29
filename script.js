const knowledgeBase = {
    "sandhi": "Sandhi (union) is the process of combining sounds. Example: Deva + Alaya = Devalaya (Savarna Dirgha Sandhi).",
    "karmanye": "This shloka from Bhagavad Gita (2.47) means: You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    "hello": "Namaste! (नमस्ते) - This is the standard greeting in Sanskrit."
};

function askTeacher() {
    const input = document.getElementById('userInput').value.toLowerCase();
    const responseArea = document.getElementById('responseArea');
    const responseText = document.getElementById('teacherResponse');

    responseArea.classList.remove('hidden');
    
    // Logic to simulate a "Teacher" thinking/searching
    let answer = "That is a profound question. Let me analyze it... ";

    // Basic Search Logic
    const match = Object.keys(knowledgeBase).find(key => input.includes(key));
    
    if (match) {
        answer += knowledgeBase[match];
    } else {
        answer = "I am still learning this specific topic. However, in Sanskrit grammar, most words follow the Dhatu (root) system. Try searching for 'Sandhi' or a Gita verse.";
    }

    responseText.innerHTML = `<p>${answer}</p>`;
}