// ⚠️ IMPORTANT: Replace with your actual API key
const API_KEY = "AIzaSyCdUqkPFjmOIPBbI4mnZTjxEceGoH-I8eQE";

const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const loading = document.getElementById("loading");
const clearBtn = document.getElementById("clearBtn");

let chatHistory = [];

// Initialize Gemini AI
const { GoogleGenerativeAI } = window;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Send message on button click
sendBtn.addEventListener("click", sendMessage);

// Send message on Enter key
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && userInput.value.trim()) {
        sendMessage();
    }
});

// Clear chat
clearBtn.addEventListener("click", () => {
    messagesDiv.innerHTML = "";
    chatHistory = [];
    userInput.value = "";
});

async function sendMessage() {
    const message = userInput.value.trim();
    

    // Add user message to UI
    addMessage(message, "user");
    userInput.value = "";
    sendBtn.disabled = true;
    loading.style.display = "flex";

    try {
        // Create chat session
        const chat = model.startChat({
            history: chatHistory,
        });

        // Send message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response.text();

        // Add bot response to UI
        addMessage(response, "bot");

        // Update chat history
        chatHistory.push({
            role: "user",
            parts: [{ text: message }],
        });
        chatHistory.push({
            role: "model",
            parts: [{ text: response }],
        });

    } catch (error) {
        console.error("Error:", error);
        addMessage(`❌ Error: ${error.message}`, "bot");
    } finally {
        loading.style.display = "none";
        sendBtn.disabled = false;
        userInput.focus();
        scrollToBottom();
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);

    scrollToBottom();
}

function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}