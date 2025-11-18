const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

wss.on("connection", ws => {
    console.log("Client terhubung (Layer 5: Session)");

    ws.on("message", message => {
        try {
            const msg = JSON.parse(message); // Layer 6 Presentation
            // broadcast ke semua client
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(msg));
                }
            });
        } catch (err) {
            console.error("Invalid message format", err);
        }
    });

    ws.on("close", () => {
        console.log("Client terputus");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
