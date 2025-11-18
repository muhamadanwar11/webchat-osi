const protocol = location.protocol === "https:" ? "wss:" : "ws:";
const socketUrl = protocol + "//" + location.host;
const socket = new WebSocket(socketUrl);

const chat = document.getElementById("chat");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

socket.onopen = () => {
    appendSystem("Terhubung ke server.");
};

socket.onmessage = (event) => {
    try {
        const msg = JSON.parse(event.data);
        appendMessage(msg.name, msg.text);
    } catch (err) {
        console.error("Gagal parse message", err);
    }
};

socket.onclose = () => {
    appendSystem("Terputus dari server.");
};

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const name = nameInput.value.trim() || "Anon";
    const text = messageInput.value.trim();
    if (!text) return;
    const payload = { name, text, ts: Date.now() };
    socket.send(JSON.stringify(payload)); // Layer 6: JSON
    messageInput.value = "";
}

function appendMessage(name, text) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${escapeHtml(name)}:</strong> ${escapeHtml(text)}`;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}

function appendSystem(text) {
    const p = document.createElement("p");
    p.style.opacity = "0.7";
    p.textContent = text;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}

function escapeHtml(s) {
    return s.replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}
