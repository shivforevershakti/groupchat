import { useState, useEffect } from "react";
import { Input, Button, Card, Typography } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoinChatForm from "./JoinChatForm";

const { Title, Text } = Typography;

interface Message {
    username: string;
    text: string;
}

interface MessageListProps {
    messages: Message[];
    username: string;
}


const MessageList: React.FC<MessageListProps> = ({ messages, username }) => (
    <div className="flex-1 h-[65vh] overflow-y-auto overflow-x-hidden p-3 rounded-md bg-gray-50 mb-4 w-full flex flex-col">
        {messages.length === 0 ? (
            <Text className="text-gray-400 self-center">No messages yet. Start the conversation!</Text>
        ) : (
            messages.map((msg, index) => (
                <div
                    key={index}
                    className={`group relative mb-2 p-2 rounded-md max-w-[75%] break-words ${msg.username === username
                        ? "bg-blue-500 text-white self-end text-right ml-auto"
                        : "bg-gray-200 text-black self-start text-left mr-auto"
                        }`}
                >
                    {/* Show full username only on hover */}
                    <span className="absolute -top-5 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {msg.username}
                    </span>
                    <Text className="font-semibold">
                        {username !== msg.username ? msg.username.charAt(0).toUpperCase() : ""}
                        {username !== msg.username ? ":" : ""}
                    </Text>{" "}
                    {msg.text}
                </div>
            ))
        )}
    </div>
);




interface ChatInputProps {
    message: string;
    setMessage: (message: string) => void;
    sendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, sendMessage }) => (
    <>
        <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={sendMessage}
            className="mb-3 p-2 rounded-md border border-gray-300"
        />
        <div className="mt-3">
            <Button type="primary" className="w-full bg-blue-500" onClick={sendMessage}>
                Send
            </Button>
        </div>
    </>
);


const Chat: React.FC = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);


    useEffect(() => {
        if (isConnected) {
            const websocket = new WebSocket("ws://localhost:5000");
            setWs(websocket);

            websocket.onopen = () => {
                websocket.send(JSON.stringify({ type: "new_user", username }));
            };

            websocket.onmessage = (event) => {
                const data: Message | Message[] = JSON.parse(event.data);
                setMessages((prev) => (Array.isArray(data) ? [...prev, ...data] : [...prev, data]));
            };

            return () => websocket.close();
        }
    }, [isConnected, username]);

    const sendMessage = () => {
        if (ws && message.trim()) {
            ws.send(JSON.stringify({ type: "message", username, text: message }));
            setMessage("");
        }
    };

    const handleCreatedUser = async () => {
        try {
            const response = await axios.post<{ success: boolean; message: string }>(
                "http://localhost:5000/api/auth/register",
                { username, email }
            );

            if (response.data.success) {
                setIsConnected(true);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Error creating user. Please try again.");
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <ToastContainer />
            {!isConnected ? (
                <JoinChatForm {...{ username, setUsername, email, setEmail, handleCreatedUser, setProfileImage }} />
            ) : (
                <Card className="w-full max-w-2xl h-[90vh] flex flex-col shadow-lg p-6 rounded-lg bg-white">
                    <Title level={4} className="text-blue-500">Welcome, {username}!</Title>

                    {/* This div should take up available space and allow scrolling inside */}
                    <div className="flex-1 overflow-hidden">
                        <MessageList messages={messages} username={username} />
                    </div>

                    {/* Chat input stays at the bottom */}
                    <ChatInput {...{ message, setMessage, sendMessage }} />
                </Card>


            )}
        </div>
    );
};

export default Chat;
