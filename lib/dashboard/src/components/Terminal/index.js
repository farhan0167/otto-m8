import { useEffect, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

const WebSocketTerminal = () => {
    const [currentInput, setCurrentInput] = useState("");
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        // Initialize Xterm terminal
        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            theme: { background: "#1E1E1E", foreground: "#FFFFFF" },
            convertEol: true,
        });

        const terminalContainer = document.getElementById("terminal-container");
        if (terminalContainer) {
            terminal.open(terminalContainer);
            terminal.write("Connected to otto-m8 backend\r\n");
        }

        // Establish WebSocket connection
        const ws = new WebSocket("ws://localhost:8000/terminal");

        ws.onopen = () => {
            terminal.write("$ ");
        };

        ws.onmessage = (event) => {
            console.log("WebSocket message:", event.data);
            terminal.write(`\r\n${event.data}\r\n$ `);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            terminal.write("\r\n[WebSocket Error]\r\n");
        };

        ws.onclose = () => {
            terminal.write("\r\n[Connection closed]\r\n");
        };

        setWebSocket(ws);

        // Handle user input
        terminal.onData((data) => {
            setCurrentInput((prevInput) => {
                if (data === "\r") { // Enter key
                    if (prevInput === "clear") {
                        terminal.clear();
                        terminal.write("\r\n$ ");
                        return "";
                    }
                    else if (prevInput.trim()) {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(prevInput);
                        } else {
                            terminal.write("\r\n[Error: WebSocket not connected]\r\n$ ");
                        }
                    }
                    terminal.write("\r\n$ ");
                    return ""; // Clear input after sending
                } else if (data === "\x7F") { // Backspace key
                    if (prevInput.length > 0) {
                        terminal.write("\b \b");
                        return prevInput.slice(0, -1);
                    }
                } else {
                    terminal.write(data);
                    return prevInput + data;
                }
                return prevInput;
            });
        });

        return () => {
            ws.close();
            terminal.dispose();
        };
    }, []);

    return <div id="terminal-container" style={{ width: "100%", height: "400px" }} />;
};

export default WebSocketTerminal;
