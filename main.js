const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const textInput = document.getElementById('text-input');
const sendButton = document.getElementById('send-button');
const chatbotIcon = document.getElementById('chatbot-icon');
const closeButton = document.getElementById('close-button'); // Get the close button

let isChatOpen = false; // Track chat window state

        const botResponses = {
            "hi": "Hello there!",
            "hello": "Hi there! How can I help you today?",
            "how are you": "I'm doing well, thank you!",
            "what is your name": "I am a simple chatbot.",
            "default": "I'm sorry, I don't understand that. Please try again.",
            "help": "I can answer simple questions like 'hello', 'how are you', and 'what is your name'.",
            "thank you": "You're welcome!",
            "bye": "Goodbye!"
        };

        function sendMessage() {
            const messageText = textInput.value.trim();

            if (messageText === '') return;

            displayMessage('You', messageText, 'user');
            textInput.value = '';

            const lowerCaseMessage = messageText.toLowerCase();
            const response = botResponses[lowerCaseMessage] || botResponses['default'];
            setTimeout(() => {
                displayMessage('Chatbot', response, 'bot');
            }, 500);
        }

        function displayMessage(sender, message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            const senderDiv = document.createElement('div');
            senderDiv.classList.add('sender');
            senderDiv.textContent = sender;
            const textDiv = document.createElement('div');
            textDiv.classList.add('text');
            textDiv.textContent = message;

            if (type === 'user') {
                messageDiv.classList.add('user-message');
            } else {
                messageDiv.classList.add('bot-message');
            }

            messageDiv.appendChild(senderDiv);
            messageDiv.appendChild(textDiv);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function toggleChat() {
            isChatOpen = !isChatOpen; // Toggle the state
            if (isChatOpen) {
                chatContainer.style.display = 'flex'; // Show the chat container
            } else {
                chatContainer.style.display = 'none';    // Hide the chat container
            }
        }

        sendButton.addEventListener('click', sendMessage);
        textInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        chatbotIcon.addEventListener('click', toggleChat); //show chatbot when icon is clicked
        closeButton.addEventListener('click', toggleChat); // Close chat when close button is clicked