const chat = document.getElementById("chat");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const status = document.getElementById("status");

function add(who, text) {
    const d = document.createElement("div");
    d.className = "msg " + (who === "user" ? "user" : "bot");
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}

async function send() {
    const txt = msgInput.value.trim();
    if (!txt) return;
    add("user", txt);
    msgInput.value = "";
    status.textContent = "Thinking...";
    sendBtn.disabled = true;

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: txt })
        });
        const data = await res.json();
        add("bot", data.reply);
        status.textContent = "Ready";
    } catch (err) {
        add("bot", "Error: " + err.message);
        status.textContent = "Error";
        console.error(err);
    } finally {
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener("click", send);
msgInput.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

// Health-check to update status
async function checkHealth() {
    try {
        const r = await fetch("/health");
        if (r.ok) status.textContent = "Server running. Model may still be loading on first boot.";
    } catch (e) {
        status.textContent = "Server not reachable.";
    }
}
checkHealth();
