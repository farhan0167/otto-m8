import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { FaCircleArrowUp } from "react-icons/fa6";
import DropdownButton from './DropUpUtility';
import { fetchTemplate, fetchChatHistory } from './Utils/fetchUtils';


const ChatComponent = () => {
    const params = useParams();
    const template_id = params.id;
    const { token, logout } = useAuth(); 

    const [deploymentUrl, setDeploymentUrl] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

  // Fetch template on mount
  useEffect(() => {
    fetchTemplate(
        setDeploymentUrl, template_id, token
    );
  }, [template_id]);

  // Fetch chat history when deploymentUrl changes
  useEffect(() => {
    if (deploymentUrl) {
      fetchChatHistory(
        setChatHistory, deploymentUrl
      );
    }
  }, [deploymentUrl]);

  // Handle user input submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    // Append user message to chat history
    const newUserMessage = { role: 'user', content: userInput };
    const updatedChatHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedChatHistory);
    setLoading(true);
    setUserInput('');

    try {
      // Call run_chat/ endpoint
      const response = await fetch(`${deploymentUrl}/run_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const botMessage = await response.json();
      // Append bot response to chat history
      setChatHistory((prevHistory) => [...prevHistory, botMessage]);
    } catch (error) {
      console.error('Error sending message to chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container" style={{ maxWidth: '90vw', padding: '20px', width: '60%', margin: 'auto', minHeight: '100vh' }}>
        <div className="chat-history" style={{ padding: '10px', height: '90%', overflowY: 'auto' }}>
        {chatHistory.map((message, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
            {message.role === 'assistant' && (!message.tool_calls || message.tool_calls.length === 0) ? (
            // Assistant messages
            <div
                style={{
                padding: '20px',
                wordBreak: 'break-word',
                maxWidth: '80%', // Adjust max width
                marginRight: 'auto', // Align to the left
                textAlign: 'left', // Left-align text inside the box
                }}
            >
                <strong>Bot</strong>
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            ) : message.role === 'user' ? (
            // User messages
                <div
                style={{
                    display: 'flex',         // Use flex to align the box properly
                    justifyContent: 'flex-end', // Align the box to the right side
                    padding: '20px',
                    marginTop: '10px',
                }}
                >
                    <div
                        style={{
                        backgroundColor: '#f0f0f0',
                        padding: '20px',
                        borderRadius: '30px',
                        wordBreak: 'break-word',
                        textAlign: 'left', // Left-align text inside the box
                        maxWidth: '90%', // Optionally, you can add maxWidth to prevent the box from stretching too wide
                        width: 'auto', // Let the width adjust to the content
                        display: 'inline-block', // Ensure the box only takes as much width as necessary
                        }}
                    >
                        <p
                        style={{
                            margin: 0, // Remove default margin to prevent unwanted spacing
                            whiteSpace: 'pre-wrap', // Ensure multi-line content wraps properly
                            wordBreak: 'break-word', // Ensure long words break and don't overflow
                        }}
                        >
                        {message.content}
                        </p>
                    </div>
                </div>

            ): null}
        </div>
    ))}
    </div>
        <div 
        style={{
            height: '10%',
            position: 'sticky', // Ensure the form sticks to the bottom of the container
            bottom: '0',
            zIndex: 1,
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '10px' }}>
            <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a message..."
                style={{ 
                    flex: 1, 
                    padding: '10px', 
                    borderRadius: '14px', 
                    border: '1px solid #ccc',
                    //minHeight: '50px', // Set a minimum height for the textarea
                    maxHeight: '350px', // Limit the height to avoid it growing too large
                    width: '100%',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}
            />
            <button
                type="submit"
                disabled={loading}
                style={{ marginLeft: '10px', color: 'white', border: 'none', backgroundColor:'transparent' }}
            >
                {loading ? <FaCircleArrowUp color='gray' size={35}/> : <FaCircleArrowUp color='black' size={35}/>}
            </button>
            </form>
            </div>
        <DropdownButton 
            setChatHistory={setChatHistory}
            deploymentUrl={deploymentUrl}
        />
    </div>

  );
};

export default ChatComponent;
