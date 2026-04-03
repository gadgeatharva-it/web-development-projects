document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.querySelector('.chat-body');
    const messageInput = document.querySelector('.message-input');
    const sendMessageButton = document.querySelector('#send-message');
    const chatForm = document.querySelector('.chat-form');
    const fileInput = document.querySelector('#file-input');

    let selectedFile = null;
    let selectedFileData = null;

    // ✅ PUT YOUR GEMINI API KEY HERE
    const API_KEY = "AIzaSyCdUqkPFjmOIPBbI4mnZTjxEceGoH-I8eQ";

    const API_URL =
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${API_KEY}`;

    const scrollToBottom = () => {
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const createMessageElement = (content, ...classes) => {
        const div = document.createElement('div');
        div.classList.add('message', ...classes);
        div.innerHTML = content;
        return div;
    };

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle file selection
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        selectedFile = file;
        selectedFileData = await fileToBase64(file);

        const previewDiv = createMessageElement(
            `<div class="message-text">
                <img src="${selectedFileData}" class="image-preview">
            </div>`,
            'user-message'
        );

        chatBody.appendChild(previewDiv);
        scrollToBottom();
    };

    fileInput.addEventListener('change', handleFileSelect);

    const createBotAvatar = () => `
        <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9z"></path>
        </svg>
    `;

    const createThinkingIndicator = () => `
        <div class="thinking-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;

    // Gemini API call
    const generateBotResponse = async (message, imageData = null) => {
        const thinkingDiv = createMessageElement(
            `${createBotAvatar()}<div class="message-text">${createThinkingIndicator()}</div>`,
            'bot-message'
        );
        chatBody.appendChild(thinkingDiv);
        scrollToBottom();

        try {
            const parts = [];

            if (imageData) {
                const base64Data = imageData.split(',')[1];
                const mimeType = imageData.match(/data:([^;]+);/)?.[1] || 'image/jpeg';

                parts.push({
                    inline_data: {
                        mime_type: mimeType,
                        data: base64Data
                    }
                });
            }

            if (message) {
                parts.push({ text: message });
            }

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: parts
                    }]
                })
            });

            const data = await response.json();
            console.log(data);

            thinkingDiv.remove();

            if (!response.ok) {
                throw new Error(data.error?.message || "API error");
            }

            const botReply =
                data.candidates?.[0]?.content?.parts?.[0]?.text;

            const botMessageDiv = createMessageElement(
                `${createBotAvatar()}<div class="message-text">${botReply}</div>`,
                'bot-message'
            );
            chatBody.appendChild(botMessageDiv);
            scrollToBottom();

        } catch (error) {
            thinkingDiv.remove();
            const errorDiv = createMessageElement(
                `${createBotAvatar()}<div class="message-text">Error: ${error.message}</div>`,
                'bot-message'
            );
            chatBody.appendChild(errorDiv);
            scrollToBottom();
        }
    };

    const handleOutgoingMessage = (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        const hasImage = selectedFileData !== null;

        if (!message && !hasImage) return;

        const currentImageData = selectedFileData;

        messageInput.value = '';
        selectedFile = null;
        selectedFileData = null;
        fileInput.value = '';

        const userMessageDiv = createMessageElement(
            `<div class="message-text">${message}</div>`,
            'user-message'
        );
        chatBody.appendChild(userMessageDiv);
        scrollToBottom();

        setTimeout(() => generateBotResponse(message, currentImageData), 300);
    };

    chatForm.addEventListener('submit', handleOutgoingMessage);
    sendMessageButton.addEventListener('click', handleOutgoingMessage);

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleOutgoingMessage(e);
        }
    });

    document.querySelector('#file-upload').addEventListener('click', () => {
        fileInput.click();
    });

    scrollToBottom();
});