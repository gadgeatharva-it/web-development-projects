import { GoogleGenerativeAI } from "@google/generative-ai";

const button = document.querySelector(".send");
const input = document.querySelector(".input");
const message_area = document.querySelector(".message_area");
const loader = document.querySelector(".loading");

const genAi = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
let chatHistory = [];

const SYSTEM_CONTEXT = [
  {
    role: "user",
    parts: "Who is your owner/creator? Do you know? You are created by Aditya. His github link is https://github.com/adiyadav123",
  },
  {
    role: "model",
    parts: "Okay, I understand. I'll mention that I'm created by Aditya and provide his GitHub link.",
  },
];

const model = genAi.getGenerativeModel({ model: "gemini-pro" });

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatText(text) {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<i>$1</i>");
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+)/g,
    (match) => `<a href="${match}" style="color: blue;" target="_blank">${match}</a>`
  );
  return formatted;
}

function addMessageToUI(message, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`;
  
  const imgDiv = document.createElement("div");
  imgDiv.className = "img";
  const img = document.createElement("img");
  img.src = isUser ? "/my_face-removebg-preview.png" : "/logo.png";
  img.alt = isUser ? "User" : "AI";
  imgDiv.appendChild(img);
  
  const textDiv = document.createElement("div");
  textDiv.className = "text";
  textDiv.innerHTML = formatText(isUser ? escapeHtml(message) : message);
  
  messageDiv.appendChild(imgDiv);
  messageDiv.appendChild(textDiv);
  message_area.appendChild(messageDiv);
  message_area.scrollTop = message_area.scrollHeight;
}

async function sendMessage() {
  const prompt = input.value.trim();
  
  if (!prompt) {
    alert("Please enter a prompt");
    return;
  }
  
  addMessageToUI(prompt, true);
  input.value = "";
  loader.style.visibility = "visible";

  try {
    // Combine system context with chat history
    const fullHistory = [...SYSTEM_CONTEXT, ...chatHistory];
    
    const chat = model.startChat({
      history: fullHistory,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessageStream(prompt);
    const response = await result.response;
    const text = await response.text();

    // Add to chat history for next message
    chatHistory.push({ role: "user", parts: prompt });
    chatHistory.push({ role: "model", parts: text });

    addMessageToUI(text, false);
  } catch (error) {
    console.error("Error:", error);
    addMessageToUI(`Error: ${error.message}`, false);
  } finally {
    loader.style.visibility = "hidden";
  }
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});