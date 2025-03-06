const { WebSocketServer } = require("ws");
const Message = require("../models/message");

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws) => {

        let username = "Anonymous";

        // Send last 20 messages to new user
        const recentMessages = await Message.find().sort({ timestamp: -1 }).limit(20);
        const allPreviousMessageList = recentMessages.reverse().map(item=> ({type:"history" , text:item.text , date:item.timestamp , username:item.username}));
       if(allPreviousMessageList.length > 0){
          ws.send(JSON.stringify(allPreviousMessageList));
       }
        ws.on("message", async (message) => {
            const data = JSON.parse(message);

            if (data.type === "new_user") {
                username = data.username || "Anonymous";
                broadcast(wss, { type: "info", message: `${username} joined the chat!` });
            } else if (data.type === "message") {
                username = data.username;
                const newMessage = new Message({ username, text: data.text });
                await newMessage.save();

                broadcast(wss, { type: "message", username, text: data.text });
            }
        });

        ws.on("close", () => {
            console.log(`${username} disconnected`);
            broadcast(wss, { type: "info", message: `${username} left the chat.` });
        });
    });

    const broadcast = (wss, message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(message));
            }
        });
    };
};

module.exports = setupWebSocket;
